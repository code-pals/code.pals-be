const pool = require('../utils/pool');

module.exports = class Post {
  post_id;
  posted_by;
  title;
  code;
  question;
  created;

  constructor(row) {
    this.post_id = row.post_id;
    this.posted_by = row.posted_by;
    this.title = row.title;
    this.code = row.code;
    this.question = row.question;
    this.created = row.created;
  }

  static async insert({ posted_by, title, code, question }) {
    const { rows } = await pool.query(
      `
        INSERT INTO posts (posted_by, title, code, question)
        VALUES($1, $2, $3, $4)
        RETURNING *`,
      [posted_by, title, code, question]
    );

    return new Post(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
        SELECT * FROM posts`);

    return rows.map((row) => new Post(row));
  }
  static async getById(post_id) {
    const { rows } = await pool.query(
      `
        SELECT * FROM posts WHERE post_id=$1
      `,
      [post_id]
    );

    if (!rows[0]) return null;
    return new Post(rows[0]);
  }

  static async update(post_id, { posted_by, title, code, question, created }) {
    const { rows } = await pool.query(
      `
        UPDATE posts SET
       posted_by=$2, title=$3, code=$4, question=$5, created=$6
        WHERE post_id=$1
        RETURNING *`,
      [post_id, posted_by, title, code, question, created]
    );

    return new Post(rows[0]);
  }

  static async delete(post_id) {
    const { rows } = await pool.query(
      `
        DELETE FROM posts WHERE post_id=$1
        RETURNING *`,
      [post_id]
    );

    if (!rows[0]) return null;
    return new Post(rows[0]);
  }
};
