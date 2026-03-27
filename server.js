import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rushiraj_creation',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function createTables() {
  const createInvoicesTable = `
    CREATE TABLE IF NOT EXISTS invoices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoiceNumber VARCHAR(255),
      invoiceDate DATE,
      companyName VARCHAR(255),
      companyAddress TEXT,
      companyCity VARCHAR(255),
      companyState VARCHAR(255),
      companyPincode VARCHAR(255),
      companyPhone VARCHAR(255),
      companyGstin VARCHAR(255),
      companyPan VARCHAR(255),
      companyLogoLeftUrl TEXT,
      companyLogoRightUrl TEXT,
      clientName VARCHAR(255),
      clientAddress TEXT,
      clientCity VARCHAR(255),
      clientState VARCHAR(255),
      clientPincode VARCHAR(255),
      clientPhone VARCHAR(255),
      clientGstin VARCHAR(255),
      clientPan VARCHAR(255),
      items JSON,
      bank JSON,
      paidDetails JSON,
      terms JSON,
      igst BOOLEAN,
      signatureUrl TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createChallansTable = `
    CREATE TABLE IF NOT EXISTS challans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      challanNo VARCHAR(255),
      orderNo VARCHAR(255),
      date DATE,
      \`from\` VARCHAR(255),
      \`to\` VARCHAR(255),
      items JSON,
      totalAmount DECIMAL(10,2),
      receivedBy VARCHAR(255),
      signatureUrl TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(createInvoicesTable);
  console.log('Invoices table ready.');

  await pool.query(createChallansTable);
  console.log('Challans table ready.');
}

createTables().catch(err => {
  console.error('Failed to create tables:', err.message || err);
});

const dbConnected = () => pool && typeof pool.execute === 'function';
const sendDbUnavailable = (res) => res.status(503).json({ error: 'Database not connected. Please set up MySQL first.' });

app.post('/api/invoices', async (req, res) => {
  if (!dbConnected()) return sendDbUnavailable(res);
  const data = req.body;

  const sql = `
    INSERT INTO invoices (
      invoiceNumber, invoiceDate, companyName, companyAddress, companyCity, companyState,
      companyPincode, companyPhone, companyGstin, companyPan, companyLogoLeftUrl, companyLogoRightUrl,
      clientName, clientAddress, clientCity, clientState, clientPincode, clientPhone,
      clientGstin, clientPan, items, bank, paidDetails, terms, igst, signatureUrl
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.invoiceNumber || '', data.invoiceDate || null, data.companyName || '',
    data.companyAddress || '', data.companyCity || '', data.companyState || '',
    data.companyPincode || '', data.companyPhone || '', data.companyGstin || '', data.companyPan || '',
    data.companyLogoLeftUrl || '', data.companyLogoRightUrl || '', data.clientName || '', data.clientAddress || '',
    data.clientCity || '', data.clientState || '', data.clientPincode || '', data.clientPhone || '',
    data.clientGstin || '', data.clientPan || '', JSON.stringify(data.items || []),
    JSON.stringify(data.bank || {}), JSON.stringify(data.paidDetails || {}), JSON.stringify(data.terms || []),
    data.igst ? 1 : 0, data.signatureUrl || ''
  ];

  try {
    const [result] = await pool.execute(sql, values);
    res.json({ id: result.insertId, message: 'Invoice saved successfully' });
  } catch (err) {
    console.error('Error saving invoice:', err);
    const details = err && err.message ? err.message : String(err);
    res.status(500).json({ error: 'Failed to save invoice', details });
  }
});

app.get('/api/invoices', async (req, res) => {
  if (!dbConnected()) return sendDbUnavailable(res);
  try {
    const [results] = await pool.execute('SELECT * FROM invoices ORDER BY createdAt DESC');
    const invoices = results.map(row => ({
      ...row,
      items: JSON.parse(row.items || '[]'),
      bank: JSON.parse(row.bank || '{}'),
      paidDetails: JSON.parse(row.paidDetails || '{}'),
      terms: JSON.parse(row.terms || '[]'),
      igst: row.igst === 1 || row.igst === true
    }));
    res.json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    const details = err && err.message ? err.message : String(err);
    res.status(500).json({ error: 'Failed to fetch invoices', details });
  }
});

app.post('/api/challans', async (req, res) => {
  if (!dbConnected()) return sendDbUnavailable(res);
  const data = req.body;

  const sql = `
    INSERT INTO challans (
      challanNo, orderNo, date, \`from\`, \`to\`, items, totalAmount, receivedBy, signatureUrl
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.challanNo || '', data.orderNo || '', data.date || null, data.from || '', data.to || '',
    JSON.stringify(data.items || []), data.totalAmount || 0, data.receivedBy || '', data.signatureUrl || ''
  ];

  try {
    const [result] = await pool.execute(sql, values);
    res.json({ id: result.insertId, message: 'Challan saved successfully' });
  } catch (err) {
    console.error('Error saving challan:', err);
    const details = err && err.message ? err.message : String(err);
    res.status(500).json({ error: 'Failed to save challan', details });
  }
});

app.get('/api/challans', async (req, res) => {
  if (!dbConnected()) return sendDbUnavailable(res);
  try {
    const [results] = await pool.execute('SELECT * FROM challans ORDER BY createdAt DESC');
    const challans = results.map(row => ({ ...row, items: JSON.parse(row.items || '[]') }));
    res.json(challans);
  } catch (err) {
    console.error('Error fetching challans:', err);
    const details = err && err.message ? err.message : String(err);
    res.status(500).json({ error: 'Failed to fetch challans', details });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Try another port (e.g., PORT=3002).`);
  } else {
    console.error('Server failed:', err);
  }
  process.exit(1);
});

process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Database connection pool closed.');
  } catch (err) {
    console.error('Error closing pool:', err);
  }
  process.exit(0);
});
