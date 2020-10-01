const pool = require('../utils/pool');

module.exports = class Gram {
  id;
  photo_url;
  caption;
  tags;
  user_id;

  constructor(row) {
    this.id = row.id,
    this.photo_url = row.photo_url,
    this.caption = row.caption,
    this.tags = row.tags,
    this.user_id = row.user_id;
  }

  // add a gram post 
  static async insert(gram) {
    const { rows } = await pool.query(`
    INSERT INTO grams (photo_url, caption, tags, user_id) VALUES ($1, $2, $3, $4) RETURNING *
    `, [gram.photo_url, gram.caption, gram.tags, gram.user_id]);

    return new Gram(rows[0]);
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM grams');
    return rows.map((row) => new Gram(row));
  }

  static async findGramById(gramId) {
    const { rows } = await pool.query(`
    SELECT * FROM grams
    WHERE id=$1`, [gramId]);

    if(!rows[0]) return null;
    else return new Gram(rows[0]);
  }
};
