import mysql from 'mysql';
import dotenv from 'dotenv'
dotenv.config()

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.PORT),
});

export default connection;
