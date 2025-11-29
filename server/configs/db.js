import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require', // optional for production
});

export default sql;
