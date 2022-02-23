const pool = require('../utils/pool');

module.exports = class User {
  userId;
  github;
  email;
  avatar;
  repos;
  bio;
  memberSince;
  created;

  constructor(row) {
    this.userId = row.user_id;
    this.github = row.github;
    this.email = row.email;
    this.avatar = row.avatar;
    this.repos = row.repos;
    this.bio = row.bio;
    this.memberSince = row.member_since;
    this.created = row.created;
  }

  static async createUser(github, email, avatar, repos, bio, memberSince) {
    const { rows } = await pool.query('INSERT INTO users (github, email, avatar, repos, bio, member_since) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [github, email, avatar, repos, bio, memberSince]);

    return new User(rows[0]);

  }

  static async getAllUsers () {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async getById (id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE user_id=$1', [id]);

    return new User(rows[0]);
  }

  static async findByUsername (username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE github=$1', [username]);

    if(!rows[0]) return null;
    return new User(rows[0]);

  }
};
