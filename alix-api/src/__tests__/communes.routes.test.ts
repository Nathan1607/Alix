import request from 'supertest';
import express from 'express';

// 💡 Crée un objet global pour stocker les mocks
const mocks = {
  mockFind: jest.fn(),
  mockFindOne: jest.fn(),
  mockFindOneBy: jest.fn(),
  mockCreate: jest.fn(),
  mockSave: jest.fn(),
  mockMerge: jest.fn(),
  mockDelete: jest.fn(),
};

// 🔁 Mock le data source AVANT l’import du router
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

// Après le mock du data source, on peut importer le router
import communesRouter from '../routes/communes.routes';

const app = express();
app.use(express.json());
app.use('/communes', communesRouter);

describe('Communes Routes', () => {
  const fakeCommunes = [
    { id: '1', nom: 'Paris' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /communes - devrait retourner la liste des communes', async () => {
    mocks.mockFind.mockResolvedValue(fakeCommunes);

    const res = await request(app).get('/communes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].nom).toBe('Paris');
  });

  it('GET /communes/1 - devrait retourner une commune', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeCommunes[0]);

    const res = await request(app).get('/communes/1');
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Paris');
  });

  it('GET /communes/999 - devrait retourner 404 si commune non trouvée', async () => {
    mocks.mockFindOne.mockResolvedValue(null);

    const res = await request(app).get('/communes/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Commune non trouvée');
  });

  it('POST /communes - devrait créer une nouvelle commune', async () => {
    const newCommune = { nom: 'Lyon' };
    mocks.mockCreate.mockReturnValue(newCommune);
    mocks.mockSave.mockResolvedValue({ id: '2', ...newCommune });

    const res = await request(app).post('/communes').send(newCommune);
    expect(res.status).toBe(201);
    expect(res.body.nom).toBe('Lyon');
  });

  it('PUT /communes/1 - devrait mettre à jour une commune existante', async () => {
    const updateData = { nom: 'Marseille' };
    const communeCopy = { ...fakeCommunes[0] };

    mocks.mockFindOneBy.mockResolvedValue(communeCopy);
    mocks.mockMerge.mockImplementation((commune, data) => Object.assign(commune, data));
    mocks.mockSave.mockResolvedValue({ ...communeCopy, ...updateData });

    const res = await request(app).put('/communes/1').send(updateData);
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Marseille');
  });

  it('PUT /communes/999 - devrait retourner 404 si commune non trouvée', async () => {
    mocks.mockFindOneBy.mockResolvedValue(null);

    const res = await request(app).put('/communes/999').send({ nom: 'Test' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Commune non trouvée');
  });

  it('DELETE /communes/1 - devrait supprimer une commune', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 1 });

    const res = await request(app).delete('/communes/1');
    expect(res.status).toBe(204);
  });

  it('DELETE /communes/999 - devrait retourner 404 si commune non trouvée', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 0 });

    const res = await request(app).delete('/communes/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Commune non trouvée');
  });

  // Tests erreurs serveur

  it('GET /communes - devrait retourner 500 en cas d’erreur serveur', async () => {
    mocks.mockFind.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/communes');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération des communes');
  });

  it('GET /communes/:id - devrait retourner 500 en cas d’erreur serveur', async () => {
    mocks.mockFindOne.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/communes/1');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération de la commune');
  });

  it('POST /communes - devrait retourner 400 en cas d’erreur serveur', async () => {
    mocks.mockCreate.mockImplementation(() => { throw new Error('Erreur création'); });

    const res = await request(app).post('/communes').send({ nom: 'Erreur' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la création de la commune');
  });

  it('PUT /communes/:id - devrait retourner 400 en cas d’erreur serveur', async () => {
    mocks.mockFindOneBy.mockResolvedValue({ id: '1', nom: 'Ancien' });
    mocks.mockMerge.mockImplementation(() => { throw new Error('Erreur merge'); });

    const res = await request(app).put('/communes/1').send({ nom: 'Nouveau' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la mise à jour de la commune');
  });

  it('DELETE /communes/:id - devrait retourner 400 en cas d’erreur serveur', async () => {
    mocks.mockDelete.mockRejectedValue(new Error('Erreur suppression'));

    const res = await request(app).delete('/communes/1');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la suppression de la commune');
  });
});
