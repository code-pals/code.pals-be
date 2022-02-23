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

  static async Insert({
    created_by,
    title,
    summary,
    goal,
    group_size,
    created,
  }) {
    const { rows } = await pool.query(
      `
        INSERT INTO boards (created_by, title, summary, goal, group_size, created)
        VALUES($1, $2, $3, $4, $5, $6)`,
      [created_by, title, summary, goal, group_size, created]
    );

    return new Board(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
        SELECT * FROM boards`);
    return rows.map((row) => Board(row));
  }

  static async getById(board_id) {
    const { rows } = await pool.query(
      `
        SELECT * FROM board WHERE id=$1
  `,
      [board_id]
    );

    if (!rows[0]) return null;
    return new Board(rows[0]);
  }
  static async update(
    board_id,
    { created_by, title, summary, goal, group_size, created }
  ) {
    const { rows } = await pool.query(
      `
        UPDATE boards WHERE created_by = $1, title = $2, summary = $3, goal = $4, group_size = $5, created = $6, board_id = $7
        RETURNING *`,
      [created_by, title, summary, goal, group_size, created, board_id]
    );

    return new Board(rows[0]);
  }

  static async delete(board_id) {
    const { rows } = await pool.query(
      `
        DELETE * FROM boards WHERE id=$1
        RETURNING *`,
      [board_id]
    );

    if (!rows[0]) return null;
    return new Board(rows[0]);
  }
};
