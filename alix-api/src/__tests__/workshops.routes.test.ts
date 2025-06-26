import request from 'supertest';
import express from 'express';

// 💡 Mocks globaux pour le repository Workshop
const mocks = {
  mockFind: jest.fn(),
  mockFindOne: jest.fn(),
  mockFindOneBy: jest.fn(),
  mockCreate: jest.fn(),
  mockSave: jest.fn(),
  mockMerge: jest.fn(),
  mockDelete: jest.fn(),
};

// Mock du data-source AVANT d'importer le router
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

// Import du router après le mock
import workshopRouter from '../routes/workshops.routes';

const app = express();
app.use(express.json());
app.use('/workshops', workshopRouter);

describe('Workshop Routes', () => {
  const fakeWorkshops = [
    { id: 1, nom: 'Atelier Test', commune: { id: 1, nom: 'Paris' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /workshops - should return all workshops', async () => {
    mocks.mockFind.mockResolvedValue(fakeWorkshops);

    const res = await request(app).get('/workshops');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].nom).toBe('Atelier Test');
  });

  it('GET /workshops/1 - should return one workshop', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeWorkshops[0]);

    const res = await request(app).get('/workshops/1');
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Atelier Test');
  });

  it('GET /workshops/999 - should return 404 if workshop not found', async () => {
    mocks.mockFindOne.mockResolvedValue(null);

    const res = await request(app).get('/workshops/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Atelier non trouvé');
  });

  it('POST /workshops - should create a new workshop', async () => {
    const newWorkshop = { nom: 'Nouveau Atelier', commune: { id: 2, nom: 'Lyon' } };
    mocks.mockCreate.mockReturnValue(newWorkshop);
    mocks.mockSave.mockResolvedValue({ id: 2, ...newWorkshop });

    const res = await request(app).post('/workshops').send(newWorkshop);
    expect(res.status).toBe(201);
    expect(res.body.nom).toBe('Nouveau Atelier');
  });

  it('PUT /workshops/1 - should update an existing workshop', async () => {
    const updatedData = { nom: 'Atelier Mis à Jour' };
    const workshopCopy = { ...fakeWorkshops[0] };

    mocks.mockFindOneBy.mockResolvedValue(workshopCopy);
    mocks.mockMerge.mockImplementation((workshop, data) => Object.assign(workshop, data));
    mocks.mockSave.mockResolvedValue({ ...workshopCopy, ...updatedData });

    const res = await request(app).put('/workshops/1').send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Atelier Mis à Jour');
  });

  it('PUT /workshops/999 - should return 404 if workshop not found', async () => {
    mocks.mockFindOneBy.mockResolvedValue(null);

    const res = await request(app).put('/workshops/999').send({ nom: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Atelier non trouvé');
  });

  it('DELETE /workshops/1 - should delete a workshop', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 1 });

    const res = await request(app).delete('/workshops/1');
    expect(res.status).toBe(204);
  });

  it('DELETE /workshops/999 - should return 404 if workshop not found', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 0 });

    const res = await request(app).delete('/workshops/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Atelier non trouvé');
  });
});

describe('Workshop Routes - Error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /workshops - should return 500 on server error', async () => {
    mocks.mockFind.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/workshops');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération des ateliers');
  });

  it('GET /workshops/:id - should return 500 on server error', async () => {
    mocks.mockFindOne.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/workshops/1');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération de l’atelier');
  });

  it('POST /workshops - should return 400 on server error', async () => {
    mocks.mockCreate.mockImplementation(() => { throw new Error('Erreur création'); });

    const res = await request(app).post('/workshops').send({ nom: 'Erreur' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la création de l’atelier');
  });

  it('PUT /workshops/:id - should return 400 on server error', async () => {
    mocks.mockFindOneBy.mockResolvedValue({ id: 1, nom: 'Ancien Atelier' });
    mocks.mockMerge.mockImplementation(() => { throw new Error('Erreur merge'); });

    const res = await request(app).put('/workshops/1').send({ nom: 'Nouveau' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la mise à jour de l’atelier');
  });

  it('DELETE /workshops/:id - should return 400 on server error', async () => {
    mocks.mockDelete.mockRejectedValue(new Error('Erreur suppression'));

    const res = await request(app).delete('/workshops/1');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la suppression de l’atelier');
  });
});
