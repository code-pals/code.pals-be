const pool = require('../utils/pool');

module.exports = class Board {
  board_id;
  created_by;
  title;
  summary;
  goal;
  group_size;
  created;
  avatar;
  github;
  username;
  repos;
  bio;

  constructor(row) {
    this.board_id = row.board_id;
    this.created_by = row.created_by;
    this.title = row.title;
    this.summary = row.summary;
    this.goal = row.goal;
    this.group_size = row.group_size;
    this.created = row.created;
    this.avatar = row.avatar;
    this.github = row.github;
    this.username = row.username;
    this.repos = row.repos;
    this.bio = row.bio;
  }

  static async insert({ created_by, title, summary, goal, group_size }) {
    const { rows } = await pool.query(
      `
        INSERT INTO boards (created_by, title, summary, goal, group_size)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *`,
      [created_by, title, summary, goal, group_size]
    );

    return new Board(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
        SELECT users.avatar, users.github, users.username, boards.board_id, boards.created_by, boards.created, boards.title, boards.summary, boards.goal, boards.group_size FROM boards
        INNER JOIN users on users.user_id = boards.created_by`);

    return rows.map((row) => new Board(row));
  }

  static async getById(board_id) {
    const { rows } = await pool.query(
      `
      SELECT users.avatar, users.github, users.bio, users.repos, boards.title, boards.summary, boards.goal, boards.group_size FROM boards
      INNER JOIN users on users.user_id = boards.created_by WHERE board_id = $1
  `,
      [board_id]
    );
    if (!rows[0]) return null;
    return new Board(rows[0]);
  }
  static async update(
    board_id,
    { title, summary, goal, group_size }
  ) {
    const { rows } = await pool.query(
      `
        UPDATE boards SET title = $2, summary = $3, goal = $4, group_size = $5
        WHERE board_id = $1
        RETURNING *`,
      [board_id, title, summary, goal, group_size]
    );

    return new Board(rows[0]);
  }

  static async delete(board_id) {
    const { rows } = await pool.query(
      `
        DELETE FROM boards WHERE board_id=$1
        RETURNING *`,
      [board_id]
    );

    if (!rows[0]) return null;
    return new Board(rows[0]);
  }
  static async getAllByUser(username) {
    const { rows } = await pool.query(`
    SELECT users.avatar, users.github, users.repos, users.bio, boards.*
    from boards
    INNER JOIN users on users.user_id = boards.created_by
    WHERE users.github = $1
    `, [username]);


    console.log('getallbyuserrows', rows);
    return rows.map((row) => new Board(row));
  }
};
