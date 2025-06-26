import request from 'supertest';
import express from 'express';

// 💡 Mocks globaux pour le repository Registration
const mocks = {
  mockFind: jest.fn(),
  mockFindOne: jest.fn(),
  mockCreate: jest.fn(),
  mockSave: jest.fn(),
  mockDelete: jest.fn(),
};

// 🧱 Setup du mock AppDataSource
const getRepoMock = jest.fn().mockReturnValue({
  find: mocks.mockFind,
  findOne: mocks.mockFindOne,
  create: mocks.mockCreate,
  save: mocks.mockSave,
  delete: mocks.mockDelete,
});

jest.mock('../config/data-source', () => ({
  AppDataSource: {
    getRepository: getRepoMock,
  },
}));

import registrationsRouter from '../routes/registrations.routes';

const app = express();
app.use(express.json());
app.use('/registrations', registrationsRouter);

describe('Registrations Routes', () => {
  const fakeRegistrations = [{
    id: 1,
    user: { id: 1, nom: 'User1' },
    event: { id: 1, nom: 'Event1' },
    workshop: null,
    registered_at: new Date().toISOString(),
  }];

  beforeEach(() => {
    jest.clearAllMocks();
    getRepoMock.mockReturnValue({
      find: mocks.mockFind,
      findOne: mocks.mockFindOne,
      create: mocks.mockCreate,
      save: mocks.mockSave,
      delete: mocks.mockDelete,
    });
  });

  // GET /
  it('GET /registrations -> 200', async () => {
    mocks.mockFind.mockResolvedValue(fakeRegistrations);
    const res = await request(app).get('/registrations');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeRegistrations);
  });

  it('GET /registrations -> 500 on error', async () => {
    mocks.mockFind.mockRejectedValue(new Error());
    const res = await request(app).get('/registrations');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération des inscriptions .');
  });

  // GET /:id
  it('GET /registrations/:id -> 200', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeRegistrations[0]);
    const res = await request(app).get('/registrations/1');
    expect(res.status).toBe(200);
    expect(res.body.user.nom).toBe('User1');
  });

  it('GET /registrations/:id -> 404', async () => {
    mocks.mockFindOne.mockResolvedValue(null);
    const res = await request(app).get('/registrations/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Inscription non trouvée');
  });

  it('GET /registrations/:id -> 500', async () => {
    mocks.mockFindOne.mockRejectedValue(new Error());
    const res = await request(app).get('/registrations/1');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération de l’inscription...');
  });

  // GET /check
  it('GET /registrations/check -> exists true', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeRegistrations[0]);
    const res = await request(app)
      .get('/registrations/check')
      .query({ userId: 1, eventId: 1 });
    expect(res.status).toBe(200);
    expect(res.body.isRegistered).toBe(true);
  });

  it('GET /registrations/check -> 400 if missing params', async () => {
    const res = await request(app).get('/registrations/check').query({ userId: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Paramètres manquants');
  });

  it('GET /registrations/check -> 500 on error', async () => {
    mocks.mockFindOne.mockRejectedValue(new Error());
    const res = await request(app)
      .get('/registrations/check')
      .query({ userId: 1, eventId: 1 });
    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Erreur lors de la récupération/);
  });

  // POST /
  it('POST /registrations -> 201', async () => {
    const post = {
      user_id: 1,
      event_id: 1,
      workshop_id: null,
      registered_at: new Date().toISOString(),
    };

    // Mocks spécifiques
    // Deux getRepository successifs pour User et Event
    getRepoMock
      .mockReturnValueOnce({ findOne: jest.fn().mockResolvedValue({ id: 1 }), create: mocks.mockCreate, save: mocks.mockSave })
      .mockReturnValueOnce({ findOne: jest.fn().mockResolvedValue({ id: 1 }), create: mocks.mockCreate, save: mocks.mockSave });

    mocks.mockCreate.mockReturnValue(post);
    mocks.mockSave.mockResolvedValue({ id: 2, ...post });

    const res = await request(app).post('/registrations').send(post);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(2);
  });

  it('POST /registrations -> 400 missing fields', async () => {
    const res = await request(app).post('/registrations').send({ user_id: 1 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Données invalides, tous les champs sont requis');
  });

  it('POST /registrations -> 400 user not found', async () => {
    getRepoMock.mockReturnValueOnce({ findOne: jest.fn().mockResolvedValue(null) });
    const res = await request(app).post('/registrations').send({
      user_id: 999, event_id: 1, workshop_id: null, registered_at: new Date().toISOString(),
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Utilisateur non trouvé');
  });

  it('POST /registrations -> 400 on create error', async () => {
    const bad = {
      user_id: 1,
      event_id: 1,
      workshop_id: null,
      registered_at: new Date().toISOString(),
    };
    getRepoMock.mockReturnValueOnce({ findOne: jest.fn().mockResolvedValue({ id: 1 }) });
    getRepoMock.mockReturnValueOnce({ findOne: jest.fn().mockResolvedValue({ id: 1 }) });

    mocks.mockCreate.mockImplementation(() => { throw new Error('bad'); });

    const res = await request(app).post('/registrations').send(bad);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la création de l’inscription');
  });

  // PUT /:id
  it('PUT /registrations/:id -> 200', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeRegistrations[0]);
    mocks.mockSave.mockResolvedValue({ ...fakeRegistrations[0], registered_at: new Date().toISOString() });
    const res = await request(app)
      .put('/registrations/1')
      .send({ registered_at: new Date().toISOString() });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('PUT /registrations/:id -> 404', async () => {
    mocks.mockFindOne.mockResolvedValue(null);
    const res = await request(app).put('/registrations/999').send({ registered_at: new Date().toISOString() });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Inscription non trouvée');
  });

  it('PUT /registrations/:id -> 400 event not found', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeRegistrations[0]);
    getRepoMock.mockReturnValueOnce({ findOne: jest.fn().mockResolvedValue(null), save: mocks.mockSave });
    const res = await request(app).put('/registrations/1').send({ event_id: 999 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Événement non trouvé');
  });

  it('PUT /registrations/:id -> 400 on save error', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeRegistrations[0]);
    mocks.mockSave.mockImplementation(() => { throw new Error('fail'); });
    const res = await request(app)
      .put('/registrations/1')
      .send({ registered_at: new Date().toISOString() });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la mise à jour de l’inscription');
  });

  // DELETE /
  it('DELETE /registrations -> 204', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeRegistrations[0]);
    mocks.mockDelete.mockResolvedValue({ affected: 1 });
    const res = await request(app)
      .delete('/registrations')
      .query({ userId: 1, eventId: 1 });
    expect(res.status).toBe(204);
  });

  it('DELETE /registrations -> 400 missing params', async () => {
    const res = await request(app).delete('/registrations').query({ userId: 1 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Paramètres manquants');
  });

  it('DELETE /registrations -> 404 not found', async () => {
    mocks.mockFindOne.mockResolvedValue(null);
    const res = await request(app)
      .delete('/registrations')
      .query({ userId: 1, eventId: 1 });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Inscription non trouvée');
  });

  it('DELETE /registrations -> 500 on delete error', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeRegistrations[0]);
    mocks.mockDelete.mockRejectedValue(new Error());
    const res = await request(app)
      .delete('/registrations')
      .query({ userId: 1, eventId: 1 });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la désinscription');
  });

  it('should return 404 if registration is not found (PUT)', async () => {
    mocks.mockFindOne.mockResolvedValue(null);
    const res = await request(app).put('/registrations/999').send({ registered_at: new Date().toISOString() });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Inscription non trouvée');
  });

});

