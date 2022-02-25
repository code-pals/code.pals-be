/* eslint-disable no-console */
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
  username;
  pronoun;
  experience;
  tech;

  constructor(row) {
    this.userId = row.user_id;
    this.github = row.github;
    this.email = row.email;
    this.avatar = row.avatar;
    this.repos = row.repos;
    this.bio = row.bio;
    this.memberSince = row.member_since;
    this.created = row.created;
    this.username = row.username;
    this.pronoun = row.pronoun;
    this.experience = row.experience;
    this.tech = row.tech;
  }

  static async createUser({ github, avatar, email, repos, bio, memberSince }) {
    const { rows } = await pool.query(
      'INSERT INTO users (github, email, avatar, repos, bio, member_since) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [github, email, avatar, repos, bio, memberSince]
    );

    console.log(rows[0]);
    return new User(rows[0]);
  }

  static async createProfile({ username, pronoun, experience, tech }, id) {
    console.log(id, 'id from models');
    const { rows } = await pool.query(
      'UPDATE users SET username=$1, pronoun=$2, experience=$3, tech=$4 WHERE users.user_id=$5 RETURNING *',
      [username, pronoun, experience, tech, id]
    );
    console.log(rows[0]);
    return new User(rows[0]);
  }

  static async getAllUsers() {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE user_id=$1', [
      id,
    ]);
    console.log('getbyIdrow0', rows[0]);
    return new User(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE github=$1', [
      username,
    ]);

    if (!rows[0]) return null;
    return new User(rows[0]);
  }
};
