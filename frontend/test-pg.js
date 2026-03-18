const { Client } = require('pg');
const connectionString = "postgresql://postgres:jsrboss8055@db.xjlddwapmlaeegdmuzml.supabase.co:5432/postgres?sslmode=require";

const client = new Client({
  connectionString: connectionString,
});

client.connect()
  .then(() => {
    console.log('Connected successfully');
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('Query successful:', res.rows[0]);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection error:', err.message);
    process.exit(1);
  });
