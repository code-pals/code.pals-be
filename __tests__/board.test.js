const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Board = require('../lib/models/Board');

const agent = request.agent(app);
jest.mock('../lib/utils/user');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a board', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');

    const res = await agent.post('/api/v1/boards').send({
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      groupSize: 4,
    });
    expect(res.body).toEqual({
      board_id: expect.any(String),
      created_by: '2',
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: '4',
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
    expect(res.body).toEqual([
      {
        ...board,
        created: expect.any(String),
        github: 'fakename',
        avatar: 'https://avatars.githubusercontent.com/u/79884362?v=4',
        username: null,
      },
    ]);
  });
  it('should get a board', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');
    const board = await Board.insert({
      created_by: '1',
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 4,
    });
    const res = await agent.get(`/api/v1/boards/${board.board_id}`);

    expect(res.body).toEqual({
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: '4',
      avatar: 'https://avatars.githubusercontent.com/u/79884362?v=4',
      github: 'fakename',
    });
  });
  it('should update a board', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');
    const board = await Board.insert({
      created_by: '1',
      title: 'Need ideas!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 4,
    });
    const res = await agent.patch(`/api/v1/boards/${board.board_id}`).send({
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
      group_size: '3',
    };
    expect(res.body).toEqual({
      ...updatedBoard,
      created: expect.any(String),
    });
  });
  it('should delete a board', async () => {
    const board = await Board.insert({
      created_by: '1',
      title: 'Closed board!',
      summary: 'Looking for talent',
      goal: 'Finish',
      group_size: 3,
    });
    const res = await agent.delete(`/api/v1/boards/${board.board_id}`);
    expect(res.body).toEqual({ ...board, created: expect.any(String) });
  });
});
