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
import userRouter from '../routes/users.routes';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User Routes', () => {
  const fakeUsers = [
    { id: 1, nom: 'Test User', commune: { id: 1, nom: 'Paris' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /users - should return all users', async () => {
    mocks.mockFind.mockResolvedValue(fakeUsers);

    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].nom).toBe('Test User');
  });

  it('GET /users/1 - should return one user', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeUsers[0]);

    const res = await request(app).get('/users/1');
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Test User');
  });

  it('GET /users/999 - should return 404 if user not found', async () => {
    mocks.mockFindOne.mockResolvedValue(null);

    const res = await request(app).get('/users/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Utilisateur non trouvé'); // ✅ Corrigé ici
  });

  it('POST /users - should create a new user', async () => {
    const newUser = { nom: 'Nouveau', commune: { id: 2, nom: 'Lyon' } };
    mocks.mockCreate.mockReturnValue(newUser);
    mocks.mockSave.mockResolvedValue({ id: 2, ...newUser });

    const res = await request(app).post('/users').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.nom).toBe('Nouveau');
  });

  it('PUT /users/1 - should update an existing user', async () => {
    const updatedData = { nom: 'Updated User' };
    const userCopy = { ...fakeUsers[0] };

    mocks.mockFindOneBy.mockResolvedValue(userCopy);
    mocks.mockMerge.mockImplementation((user, data) => Object.assign(user, data));
    mocks.mockSave.mockResolvedValue({ ...userCopy, ...updatedData });

    const res = await request(app).put('/users/1').send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Updated User');
  });

  it('PUT /users/999 - should return 404 if user not found', async () => {
    mocks.mockFindOneBy.mockResolvedValue(null);

    const res = await request(app).put('/users/999').send({ nom: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Utilisateur non trouvé'); // ✅ Corrigé ici
  });

  it('DELETE /users/1 - should delete a user', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 1 });

    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(204);
  });

  it('DELETE /users/999 - should return 404 if user not found', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 0 });

    const res = await request(app).delete('/users/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Utilisateur non trouvé'); // ✅ Corrigé ici
  });
});

it('GET /users - should return 500 on server error', async () => {
    mocks.mockFind.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/users');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération des utilisateurs');
  });

  it('GET /users/:id - should return 500 on server error', async () => {
    mocks.mockFindOne.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/users/1');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Erreur lors de la récupération de l’utilisateur");
  });

  it('POST /users - should return 400 on server error', async () => {
    mocks.mockCreate.mockImplementation(() => { throw new Error('Erreur création'); });

    const res = await request(app).post('/users').send({ nom: 'Erreur' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Erreur lors de la création de l’utilisateur");
  });

  it('PUT /users/:id - should return 400 on server error', async () => {
    // simulate found user but fail during merge/save
    mocks.mockFindOneBy.mockResolvedValue({ id: 1, nom: 'Ancien' });
    mocks.mockMerge.mockImplementation(() => { throw new Error('Erreur merge'); });

    const res = await request(app).put('/users/1').send({ nom: 'Nouveau' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Erreur lors de la mise à jour de l’utilisateur");
  });

  it('DELETE /users/:id - should return 400 on server error', async () => {
    mocks.mockDelete.mockRejectedValue(new Error('Erreur suppression'));

    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Erreur lors de la suppression de l’utilisateur");
  });
  