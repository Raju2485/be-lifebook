import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
import config from './config.ts';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.host,
  port: 5432,
  username: config.username,
  password: config.password,
  database: config.database,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});


export { sequelize };
