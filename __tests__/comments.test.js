const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Comment = require('../lib/models/Comment');
const Post = require('../lib/models/Post');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it.skip('should create a comment', async () => {
    const res = await request(app).post('/api/v1/comments').send({
      commenter: 1,
      postId: 1,
      comment: 'great question',
      parent: null,
      favorited: false,
    });

    expect(res.body).toEqual({
      commentId: expect.any(String),
      commenter: expect.any(String),
      postId: expect.any(String),
      comment: 'great question',
      parent: null,
      favorited: false,
      created: expect.any(String),
    });
  });

  it.skip('should get comments by post', async () => {});
});
