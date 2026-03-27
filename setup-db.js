import mysql from 'mysql2/promise';

async function setupDB() {
  try {
    const con1 = await mysql.createConnection({ host: 'localhost', user: 'root', password: '' });
    console.log('Connected to MySQL. Creating Database...');
    await con1.query('CREATE DATABASE IF NOT EXISTS rushiraj_creation');
    console.log('Database rushiraj_creation created or already exists.');
    await con1.end();
    process.exit(0);
  } catch (err) {
    console.error('MySQL not running or auth failed:', err.message || err);
    process.exit(1);
  }
}

setupDB();
