type Env = 'local' | 'development' | 'production' | 'test';

const env: Env = process.env.NODE_ENV as Env;

interface ConfigObject {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
  operatorsAliases: number;
  ssl: boolean;
  dialectOptions: any;
  define: any;
  logging: boolean;
  pool: any;
  PORT: number;
  JWT_SECRET_KEY: string;
  REFRESH_TOKEN_SECRET_KEY: string;
  FE_DOMAIN: string;
  MSAL: {
    EMAIL_CLIENT_ID: string;
    TENANT_ID: string;
    EMAIL_CLIENT_SECRET: string;
  };
  EMAIL_ID: string
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
  REFRESH_TOKEN_SECRET_KEY: String(process.env.LOCAL_REFRESH_TOKEN_SECRET_KEY),
  FE_DOMAIN: String(process.env.LOCAL_FE_DOMAIN),
  MSAL: {
    TENANT_ID: String(process.env.LOCAL_TENANT_ID),
    EMAIL_CLIENT_ID: String(process.env.LOCAL_EMAIL_CLIENT_ID),
    EMAIL_CLIENT_SECRET: String(process.env.LOCAL_EMAIL_CLIENT_SECRET),
  },
  EMAIL_ID: String(process.env.LOCAL_EMAIL_ID)
};

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
  REFRESH_TOKEN_SECRET_KEY: String(process.env.DEV_REFRESH_TOKEN_SECRET_KEY),
  FE_DOMAIN: String(process.env.DEV_FE_DOMAIN),
  MSAL: {
    TENANT_ID: String(process.env.DEV_TENANT_ID),
    EMAIL_CLIENT_ID: String(process.env.DEV_EMAIL_CLIENT_ID),
    EMAIL_CLIENT_SECRET: String(process.env.DEV_EMAIL_CLIENT_SECRET),
  },
  EMAIL_ID: String(process.env.DEV_EMAIL_ID)
};

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
  REFRESH_TOKEN_SECRET_KEY: String(process.env.PROD_REFRESH_TOKEN_SECRET_KEY),
  FE_DOMAIN: String(process.env.PROD_FE_DOMAIN),
  MSAL: {
    TENANT_ID: String(process.env.PROD_TENANT_ID),
    EMAIL_CLIENT_ID: String(process.env.PROD_EMAIL_CLIENT_ID),
    EMAIL_CLIENT_SECRET: String(process.env.PROD_EMAIL_CLIENT_SECRET),
  },
  EMAIL_ID: String(process.env.PROD_EMAIL_ID)
};

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
  REFRESH_TOKEN_SECRET_KEY: String(process.env.TEST_REFRESH_TOKEN_SECRET_KEY),
  FE_DOMAIN: String(process.env.TEST_FE_DOMAIN),
  MSAL: {
    TENANT_ID: String(process.env.TEST_TENANT_ID),
    EMAIL_CLIENT_ID: String(process.env.TEST_EMAIL_CLIENT_ID),
    EMAIL_CLIENT_SECRET: String(process.env.TEST_EMAIL_CLIENT_SECRET),
  },
  EMAIL_ID: String(process.env.TEST_EMAIL_ID)
};


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
