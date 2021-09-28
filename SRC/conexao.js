const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "node_postgres",
  password: "postgree",
  port: 5432,
});

const query = ((text, params) => {
    return(pool.query(text, params))
});

module.exports = {
    query
}