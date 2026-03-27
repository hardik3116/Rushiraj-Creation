# Database Setup Guide

## Current Status
✅ **Project is running!**
- Frontend: http://localhost:5173/
- Backend: http://localhost:3001/
- Database: Not connected (MySQL setup needed for full functionality)

## MySQL Database Setup

### Step 1: Install MySQL
1. Download and install MySQL from https://dev.mysql.com/downloads/mysql/
2. During installation, set up a root password (remember this for later)

### Step 2: Install phpMyAdmin
1. Download phpMyAdmin from https://www.phpmyadmin.net/
2. Extract to your web server directory (e.g., htdocs if using XAMPP)
3. Configure phpMyAdmin to connect to your MySQL server

### Step 3: Create Database
1. Open phpMyAdmin in your browser
2. Click "New" in the left sidebar
3. Enter database name: `rushiraj_creation`
4. Click "Create"

### Step 4: Update Server Configuration
1. Open `server.js`
2. Update the database connection settings:
   ```javascript
   const db = mysql.createConnection({
     host: 'localhost',
     user: 'root', // Your MySQL username
     password: 'your_mysql_password', // Your MySQL password
     database: 'rushiraj_creation'
   });
   ```

### Step 5: Restart the Application
1. Stop the current servers (Ctrl+C in terminals)
2. Start MySQL service
3. Run: `npm run dev:full`

## Tables Created Automatically
The application will automatically create the following tables:
- `invoices` - Stores invoice data
- `challans` - Stores challan data

## Troubleshooting
- Make sure MySQL service is running
- Check that the database name matches exactly
- Verify MySQL credentials in server.js
- Ensure phpMyAdmin can connect to MySQL

## Quick Start (Without Database)
The app currently runs without database functionality. You can:
- Create invoices and challans
- Generate PDFs
- Print documents
- But history won't be saved until MySQL is set up