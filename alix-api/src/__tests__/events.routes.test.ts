import request from 'supertest';
import express from 'express';

const mocks = {
  mockFind: jest.fn(),
  mockFindOne: jest.fn(),
  mockFindOneBy: jest.fn(),
  mockCreate: jest.fn(),
  mockSave: jest.fn(),
  mockMerge: jest.fn(),
  mockDelete: jest.fn(),
};

jest.mock('../config/data-source', () => ({
  AppDataSource: {
    getRepository: () => ({
      find: mocks.mockFind,
      findOne: mocks.mockFindOne,
      findOneBy: mocks.mockFindOneBy,
      create: mocks.mockCreate,
      save: mocks.mockSave,
      merge: mocks.mockMerge,
      delete: mocks.mockDelete,
    }),
  },
}));

import eventRouter from '../routes/events.routes';

const app = express();
app.use(express.json());
app.use('/events', eventRouter);

describe('Events Routes', () => {
  const fakeEvents = [
    { id: 1, nom: 'Événement Test', commune: { id: 1, nom: 'Paris' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /events - should return all events', async () => {
    mocks.mockFind.mockResolvedValue(fakeEvents);

    const res = await request(app).get('/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].nom).toBe('Événement Test');
  });

  it('GET /events?communeId=1 - should filter events by communeId', async () => {
    mocks.mockFind.mockResolvedValue(fakeEvents);

    const res = await request(app).get('/events').query({ communeId: '1' });
    expect(res.status).toBe(200);
    expect(mocks.mockFind).toHaveBeenCalledWith({
      where: { commune: { id: '1' } },
      relations: ['commune'],
    });
    expect(res.body[0].commune.id).toBe(1);
  });

  it('GET /events/1 - should return one event', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeEvents[0]);

    const res = await request(app).get('/events/1');
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Événement Test');
  });

  it('GET /events/999 - should return 404 if event not found', async () => {
    mocks.mockFindOne.mockResolvedValue(null);

    const res = await request(app).get('/events/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Événement non trouvé');
  });

  it('POST /events - should create a new event', async () => {
    const newEvent = { nom: 'Nouvel Événement', commune: { id: 2, nom: 'Lyon' } };
    mocks.mockCreate.mockReturnValue(newEvent);
    mocks.mockSave.mockResolvedValue({ id: 2, ...newEvent });

    const res = await request(app).post('/events').send(newEvent);
    expect(res.status).toBe(201);
    expect(res.body.nom).toBe('Nouvel Événement');
  });

  it('PUT /events/1 - should update an existing event', async () => {
    const updatedData = { nom: 'Événement Mis à Jour' };
    const eventCopy = { ...fakeEvents[0] };

    mocks.mockFindOneBy.mockResolvedValue(eventCopy);
    mocks.mockMerge.mockImplementation((event, data) => Object.assign(event, data));
    mocks.mockSave.mockResolvedValue({ ...eventCopy, ...updatedData });

    const res = await request(app).put('/events/1').send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Événement Mis à Jour');
  });

  it('PUT /events/999 - should return 404 if event not found', async () => {
    mocks.mockFindOneBy.mockResolvedValue(null);

    const res = await request(app).put('/events/999').send({ nom: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Événement non trouvé');
  });

  it('DELETE /events/1 - should delete an event', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 1 });

    const res = await request(app).delete('/events/1');
    expect(res.status).toBe(204);
  });

  it('DELETE /events/999 - should return 404 if event not found', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 0 });

    const res = await request(app).delete('/events/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Événement non trouvé');
  });

  // Gestion des erreurs serveur

  it('GET /events - should return 500 on server error', async () => {
    mocks.mockFind.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/events');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération des événements');
  });

  it('GET /events/:id - should return 500 on server error', async () => {
    mocks.mockFindOne.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/events/1');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération de l’événement');
  });

  it('POST /events - should return 400 on server error', async () => {
    mocks.mockCreate.mockImplementation(() => { throw new Error('Erreur création'); });

    const res = await request(app).post('/events').send({ nom: 'Erreur' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la création de l’événement');
  });

  it('PUT /events/:id - should return 400 on server error', async () => {
    mocks.mockFindOneBy.mockResolvedValue({ id: 1, nom: 'Ancien' });
    mocks.mockMerge.mockImplementation(() => { throw new Error('Erreur merge'); });

    const res = await request(app).put('/events/1').send({ nom: 'Nouveau' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la mise à jour de l’événement');
  });

  it('DELETE /events/:id - should return 400 on server error', async () => {
    mocks.mockDelete.mockRejectedValue(new Error('Erreur suppression'));

    const res = await request(app).delete('/events/1');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la suppression de l’événement');
  });
});
