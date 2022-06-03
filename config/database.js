/** Destruct environment variable to get database configuration */
const {
  DB_USERNAME = 'doqrvesm',
  DB_PASSWORD = 'uua37ZhW19JNAI-LvOD65PRWyNcfmfKx',
  DB_HOST = 'topsy.db.elephantsql.com',
  DB_NAME = 'doqrvesm',
} = process.env

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}`,
    host: DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}`,
    host: DB_HOST,
    dialect: 'postgres',
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}`,
    host: DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
}
