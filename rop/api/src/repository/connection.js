import 'dotenv/config';
import mysql from 'mysql2/promise';

const url = process.env.MYSQL_URL || process.env.DATABASE_URL;

const options = url
  ? { uri: url }
  : {
      host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
      database:
        process.env.MYSQLDATABASE ||
        process.env.DB_NAME ||
        'rop'
    };

export const con = mysql.createPool({
  ...options,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true
});