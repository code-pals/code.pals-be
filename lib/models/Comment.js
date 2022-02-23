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

};
