const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Comment = require('../lib/models/Comment');
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

  it('should create a comment', async () => {
    await agent.get('/api/v1/users/login/callback?code=42');

    const res = await agent.post('/api/v1/comments').send({
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

  it.skip('should get aggregate comment', async () => {

    const commObj = {
      commenter: 1,
      postId: 1,
      comment: 'reply to comment',
      parent: 1,
      favorited: false
    };
    const comment = await Comment.createComment(commObj);
    console.log(comment);

    const res = await agent.get('/api/v1/comments/parent/1');

    console.log('aggtest', res.body);
    expect(res.body).toEqual(expect.arrayContaining([{}, {}])
      
    );

    


  });
});
