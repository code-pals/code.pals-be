const pool = require('../utils/pool')

module.exports = class Post{
    post_id;
    posted_by;
    title;
    code;
    question;
    created;

    constructor(row){
        this.post_id = row.post_id;
        this.posted_by = row.posted_by;
        this.title = row.title;
        this.code = row.code;
        this.question = row.question;
        this.created = row.created;
    }

    static async insert({posted_by, title, code, question, created}) {
        const {rows} = await pool.query(`
        INSERT INTO posts (posted_by, title, code, question, created)
        VALUE($1, $2, $3, $4, $5)
        RETURNING *`, [posted_by, title, code, question, created])
        
        return new Post(rows[0])
    }

    static async getAll() {
        const {rows} = await pool.query(`
        SELECT * FROM posts`)

        return rows.map((row) => new Post(row))
    }
    static async getById({post_id}) {
        const {rows} = await pool.query(`
        SELECT * FROM posts WHERE id=$1
        RETURNING *`, [post_id])

        if(!rows[0]) return null
        return new Post(rows[0])
    }

    static async update(post_id, {posted_by, title, code, question, created}) {
        const {rows} = await pool.query(`
        UPDATE posts WHERE 
        posted_by = $1, title = $2, code = $3, question = $4, created = $5, posted_id = $6 
        RETURNING *`, [posted_by, title, code, question, created, post_id ])

        return new Post(rows[0])
    }

    static async delete(post_id){
        const {rows} = await pool.query(`
        DELETE * FROM posts WHERE id=$1
        RETURNING *`, [post_id])

        if(!rows[0]) return null
        return new Post(rows[0])
    }

}