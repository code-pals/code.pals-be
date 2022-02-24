const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Post = require('../lib/models/Post');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to create a post', async () => {
    const res = await request(app).post('/api/v1/posts').send({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    expect(res.body).toEqual({
      postedId: expect.any(String),
      postedBy: expect.any(String),
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
      created: expect.any(String),
    });
  });

  it('should get all post', async () => {
    const post = await Post.insert({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    const res = await request(app).get('/api/v1/posts');
    expect(res.body).toEqual([{ ...post, created: expect.any(String) }]);
  });

  it('should get a post', async () => {
    const post = await Post.insert({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    const res = await request(app).get(`/api/v1/posts/${post.postedId}`);
    expect(res.body).toEqual({ ...post, created: expect.any(String) });
  });

  it('should update a post', async () => {
    const post = await Post.insert({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    const res = await request(app)
      .patch(`/api/v1/posts/${post.postedId}`)
      .send({
        postedBy: 1,
        title: 'What is this error',
        code: 'See below',
        question: 'Any ideas?',
      });
    const updatedPost = {
      postedId: expect.any(String),
      postedBy: expect.any(String),
      title: 'What is this error',
      code: 'See below',
      question: 'Any ideas?',
    };
    expect(res.body).toEqual({ ...updatedPost, created: expect.any(String) });
  });

  it('should delete a post', async () => {
    const post = await Post.insert({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    const res = await request(app).delete(`/api/v1/posts/${post.postedId}`);
    expect(res.body).toEqual({ ...post, created: expect.any(String) });
  });
});
