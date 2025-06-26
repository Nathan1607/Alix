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

import articleRouter from '../routes/articles.routes';

const app = express();
app.use(express.json());
app.use('/articles', articleRouter);

describe('Article Routes', () => {
  const fakeArticles = [
    { id: 1, titre: 'Article Test', commune: { id: 1, nom: 'Paris' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /articles - should return all articles', async () => {
    mocks.mockFind.mockResolvedValue(fakeArticles);

    const res = await request(app).get('/articles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].titre).toBe('Article Test');
  });

  it('GET /articles/:id - should return one article', async () => {
    mocks.mockFindOne.mockResolvedValue(fakeArticles[0]);

    const res = await request(app).get('/articles/1');
    expect(res.status).toBe(200);
    expect(res.body.titre).toBe('Article Test');
  });

  it('GET /articles/999 - should return 404 if not found', async () => {
    mocks.mockFindOne.mockResolvedValue(null);

    const res = await request(app).get('/articles/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Article non trouvé');
  });

  it('POST /articles - should create a new article', async () => {
    const newArticle = { titre: 'Nouveau', commune: { id: 2 } };
    mocks.mockCreate.mockReturnValue(newArticle);
    mocks.mockSave.mockResolvedValue({ id: 2, ...newArticle });

    const res = await request(app).post('/articles').send(newArticle);
    expect(res.status).toBe(201);
    expect(res.body.titre).toBe('Nouveau');
  });

  it('PUT /articles/:id - should update an article', async () => {
    const updated = { titre: 'Modifié' };
    const articleCopy = { ...fakeArticles[0] };

    mocks.mockFindOneBy.mockResolvedValue(articleCopy);
    mocks.mockMerge.mockImplementation((a, d) => Object.assign(a, d));
    mocks.mockSave.mockResolvedValue({ ...articleCopy, ...updated });

    const res = await request(app).put('/articles/1').send(updated);
    expect(res.status).toBe(200);
    expect(res.body.titre).toBe('Modifié');
  });

  it('PUT /articles/999 - should return 404 if not found', async () => {
    mocks.mockFindOneBy.mockResolvedValue(null);

    const res = await request(app).put('/articles/999').send({ titre: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Article non trouvé');
  });

  it('DELETE /articles/:id - should delete an article', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 1 });

    const res = await request(app).delete('/articles/1');
    expect(res.status).toBe(204);
  });

  it('DELETE /articles/999 - should return 404 if not found', async () => {
    mocks.mockDelete.mockResolvedValue({ affected: 0 });

    const res = await request(app).delete('/articles/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Article non trouvé');
  });

  it('GET /articles - should return 500 on error', async () => {
    mocks.mockFind.mockRejectedValue(new Error('Erreur'));

    const res = await request(app).get('/articles');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération des articles');
  });

  it('GET /articles/:id - should return 500 on error', async () => {
    mocks.mockFindOne.mockRejectedValue(new Error('Erreur'));

    const res = await request(app).get('/articles/1');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur lors de la récupération de l’article');
  });

  it('POST /articles - should return 400 on creation error', async () => {
    mocks.mockCreate.mockImplementation(() => { throw new Error('Erreur création'); });

    const res = await request(app).post('/articles').send({ titre: 'Erreur' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la création de l’article');
  });

  it('PUT /articles/:id - should return 400 on update error', async () => {
    mocks.mockFindOneBy.mockResolvedValue({ id: 1, titre: 'Ancien' });
    mocks.mockMerge.mockImplementation(() => { throw new Error('Erreur merge'); });

    const res = await request(app).put('/articles/1').send({ titre: 'Nouveau' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la mise à jour de l’article');
  });

  it('DELETE /articles/:id - should return 400 on delete error', async () => {
    mocks.mockDelete.mockRejectedValue(new Error('Erreur suppression'));

    const res = await request(app).delete('/articles/1');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Erreur lors de la suppression de l’article');
  });
});