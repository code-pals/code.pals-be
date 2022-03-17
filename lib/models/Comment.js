/* eslint-disable no-console */
const pool = require('../utils/pool');
const Post = require('./Post');

module.exports = class Comment {
  commentId;
  commenter;
  postId;
  comment;
  parent;
  favorited;
  created;
  username;
  github;
  avatar;

  constructor(row) {
    this.commentId = row.comment_id;
    this.commenter = row.commenter;
    this.postId = row.post_id;
    this.comment = row.comment;
    this.parent = row.parent;
    this.favorited = row.favorited;
    this.created = row.created;
    this.username = row.username;
    this.github = row.github;
    this.avatar = row.avatar;
  }

  static async createComment(body) {
    const { rows } = await pool.query(
      'INSERT INTO comments (commenter, post_id, comment, parent, favorited) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [body.commenter, body.postId, body.comment, body.parent, body.favorited]
    );

    return new Comment(rows[0]);
  }

  static async getCommentsByPost(postId) {
    const { rows } = await pool.query(
      `
      SELECT users.github, users.username, users.avatar, comments.* 
      from comments
      INNER JOIN users 
      on users.user_id = comments.commenter 
      WHERE comments.post_id = $1
      `,
      [postId]
    );
    return rows.map((row) => new Comment(row));
  }
  static async aggregateByParent(postId) {
    console.log('hitsqlagg');
    const { rows } = await pool.query(
      `SELECT comments.parent,
      json_agg(to_jsonb(comments.*))
      from comments
      WHERE comments.post_id = $1
      GROUP BY comments.parent
        `, [postId]
    );
    console.log(rows);
    return rows; 
  }

  static async searchComments(keyword) {
    const { rows } = await pool.query(
      `
    SELECT users.github, users.username, users.avatar, comments.* FROM comments
    INNER JOIN users 
    on users.user_id = comments.commenter 
    WHERE comment ILIKE $1
    `,
      [`%${keyword}%`]
    );
    const comments = rows.map((row) => new Comment(row));

    const searchedPostsIds = comments.map((comment) => comment.postId);
    const uniquePostsIds = [...new Set(searchedPostsIds)];

    const getPostsOfComments = await Promise.all(
      uniquePostsIds.map(async (id) => await Post.getById(id))
    );

    const searchPostsResults = await pool.query(
      `
    SELECT users.github, users.username, users.avatar, posts.* 
    FROM posts
    INNER JOIN users
    on users.user_id = posts.posted_by
    WHERE title ILIKE $1 
    OR code ILIKE $1
    OR question ILIKE $1
    `,
      [`%${keyword}%`]
    );
        
    const searchedPosts = searchPostsResults.rows;
    const posts = searchedPosts.map((row) => new Post(row)); 
  
    return [comments, getPostsOfComments, posts];
  }

  static async favoriteComment() {
    const { rows } = await pool.query(`
    UPDATE`)
  }
};
