const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Board = require('../lib/models/Board');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a board', async () => {
    const res = await request(app).post('/api/v1/boards').send({
      created_by: '1',
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 4,
    });
    expect(res.body).toEqual({
      board_id: expect.any(String),
      created_by: '1',
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 4,
      created: expect.any(String),
    });
  });
  it('should get all boards', async () => {
    const board = await Board.insert({
      created_by: '1',
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 4,
    });
    const res = await request(app).get('/api/v1/boards');
    expect(res.body).toEqual([{ ...board, created: expect.any(String) }]);
  });
  it('should get a board', async () => {
    const board = await Board.insert({
      created_by: '1',
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 4,
    });
    const res = await request(app).get(`/api/v1/boards/${board.board_id}`);
    expect(res.body).toEqual({ ...board, created: expect.any(String) });
  });
  it('should update a board', async () => {
    const board = await Board.insert({
      created_by: '1',
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 4,
    });
    const res = await request(app)
      .patch(`/api/v1/boards/${board.board_id}`)
      .send({
        created_by: '1',
        title: 'Closed board!',
        summary: 'Looking for talent',
        goal: 'Finish',
        group_size: 3,
      });
    const updatedBoard = {
      board_id: expect.any(String),
      created_by: '1',
      title: 'Closed board!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 3,
    };
    expect(res.body).toEqual({ ...updatedBoard, created: expect.any(String) });
  });
  it('should delete a board', async () => {
    const board = await Board.insert({
      created_by: '1',
      title: 'Closed board!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 3,
    });
    const res = await request(app).delete(`/api/v1/boards/${board.board_id}`);
    expect(res.body).toEqual({ ...board, created: expect.any(String) });
  });
});
