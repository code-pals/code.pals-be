const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Post = require('../lib/models/Post');

const agent = request.agent(app);
jest.mock('../lib/utils/user');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to create a post', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');

    const res = await agent.post('/api/v1/posts').send({
      postId: '1',
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    expect(res.body).toEqual({
      postId: '1',
      postedBy: expect.any(String),
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
      created: expect.any(String),
      favorite: null,
    });
  });

  it.skip('should get all post', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');
    const post = await Post.insert({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
      favorite: null,
    });
    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([
      {
        ...post,
        created: expect.any(String),
        github: 'fakename',
        avatar: 'https://avatars.githubusercontent.com/u/79884362?v=4',
        favorite: null,
        username: null,
      },
    ]);
  });

  it('should get a post', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');
    const post = await Post.insert({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    const res = await agent.get(`/api/v1/posts/${post.postId}`);
    expect(res.body).toEqual({
      ...post,
      created: expect.any(String),
      github: 'fakename',
      avatar: 'https://avatars.githubusercontent.com/u/79884362?v=4',
      bio: 'bio',
      repos: '75',
    });
  });

  it('should update a post', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');
    const post = await Post.insert({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    const res = await agent.patch(`/api/v1/posts/${post.postId}`).send({
      postedBy: 1,
      title: 'What is this error',
      code: 'See below',
      question: 'Any ideas?',
    });
    const updatedPost = {
      postId: expect.any(String),
      postedBy: expect.any(String),
      title: 'What is this error',
      code: 'See below',
      question: 'Any ideas?',
    };
    expect(res.body).toEqual({
      ...updatedPost,
      created: expect.any(String),
      favorite: null,
      github: 'fakename',
      avatar: 'https://avatars.githubusercontent.com/u/79884362?v=4',
      bio: 'bio',
      repos: '75',
      username: null,
    });
  });

  it('should delete a post', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');
    const post = await Post.insert({
      postedBy: 1,
      title: 'What is this error???',
      code: 'See below',
      question: 'Any ideas?',
    });
    const res = await agent.delete(`/api/v1/posts/${post.postId}`);
    expect(res.body).toEqual({ ...post, created: expect.any(String) });
  });
});
