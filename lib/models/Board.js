const pool = require('../utils/pool');

module.exports = class Board {
  board_id;
  created_by;
  title;
  summary;
  goal;
  group_size;
  created;

  constructor(row) {
    this.board_id = row.board_id;
    this.created_by = row.created_by;
    this.title = row.title;
    this.summary = row.summary;
    this.goal = row.goal;
    this.group_size = row.group_size;
    this.created = row.created;
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
        SELECT * FROM boards`);
    return rows.map((row) => new Board(row));
  }

  static async getById(board_id) {
    const { rows } = await pool.query(
      `
        SELECT * FROM boards WHERE board_id=$1
  `,
      [board_id]
    );

    if (!rows[0]) return null;
    return new Board(rows[0]);
  }
  static async update(
    board_id,
    { created_by, title, summary, goal, group_size }
  ) {
    const { rows } = await pool.query(
      `
        UPDATE boards SET created_by = $2, title = $3, summary = $4, goal = $5, group_size = $6
        WHERE board_id = $1
        RETURNING *`,
      [board_id, created_by, title, summary, goal, group_size]
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
};