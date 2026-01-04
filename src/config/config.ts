type Env = 'local' | 'development' | 'production' | 'test';

const env: Env = process.env.NODE_ENV as Env;

import { Dialect } from 'sequelize';

interface ConfigObject {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  operatorsAliases: number;
  ssl: boolean;
  dialectOptions: any;
  define: any;
  logging: boolean;
  pool: any;
  PORT: number;
  JWT_SECRET_KEY: string;
}

const local: ConfigObject = {      
  username: String(process.env.local_db_username),
  password: String(process.env.local_db_password),
  database: String(process.env.local_db_name),
  host: String(process.env.local_db_host),
  dialect: 'postgres',
  operatorsAliases: 0,
  ssl: false,
  dialectOptions: {},

  define: {
    freezeTableName: true,
  },
  logging: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  PORT: Number(process.env.LOCAL_PORT),
  JWT_SECRET_KEY: String(process.env.LOCAL_JWT_SECRET_KEY),    
}

const development: ConfigObject = {      
  username: String(process.env.dev_db_username),
  password: String(process.env.dev_db_password),
  database: String(process.env.dev_db_name),
  host: String(process.env.dev_db_host),
  dialect: 'postgres',
  operatorsAliases: 0,
  ssl: false,
  dialectOptions: {},

  define: {
    freezeTableName: true,
  },
  logging: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  PORT: Number(process.env.DEV_PORT),
  JWT_SECRET_KEY: String(process.env.DEV_JWT_SECRET_KEY),    
}

const production: ConfigObject = {      
  username: String(process.env.prod_db_username),
  password: String(process.env.prod_db_password),
  database: String(process.env.prod_db_name),
  host: String(process.env.prod_db_host),
  dialect: 'postgres',
  operatorsAliases: 0,
  ssl: false,
  dialectOptions: {},

  define: {
    freezeTableName: true,
  },
  logging: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  PORT: Number(process.env.PROD_PORT),
  JWT_SECRET_KEY: String(process.env.PROD_JWT_SECRET_KEY),    
}

const test: ConfigObject = {      
  username: String(process.env.test_db_username),
  password: String(process.env.test_db_password),
  database: String(process.env.test_db_name),
  host: String(process.env.test_db_host),
  dialect: 'postgres',
  operatorsAliases: 0,
  ssl: false,
  dialectOptions: {},

  define: {
    freezeTableName: true,
  },
  logging: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  PORT: Number(process.env.TEST_PORT),
  JWT_SECRET_KEY: String(process.env.TEST_JWT_SECRET_KEY),    
}


let config = development;
if (env === 'local') {
  config = local
}
else if (env === 'production'){
config = production
}
else if (env === 'test'){
config = test
}
export default config
