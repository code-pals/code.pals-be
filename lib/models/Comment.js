const pool = require('../utils/pool');

module.exports = class Comment {
  commentId;
  commenter;
  postId;
  comment;
  parent;
  favorited;
  created;

  constructor(row) {
    this.commentId = row.comment_id;
    this.commenter = row.commenter;
    this.postId = row.post_id;
    this.comment = row.comment;
    this.parent = row.parent;
    this.favorited = row.favorited;
    this.created = row.created;
  }

  static async createComment (body) {
    const { rows } =  await pool.query('INSERT INTO comments (commenter, post_id, comment, parent, favorited) VALUES ($1, $2, $3, $4, $5) RETURNING *', [body.commenter, body.postId, body.comment, body.parent, body.favorited]);

    return new Comment(rows[0]);
  }
  
  static async getCommentsByPost(postId) {
    const { rows } = await pool.query('SELECT * from comments WHERE post_id=$1', [postId]);
    return new Comment(rows[0]);
  }

};


