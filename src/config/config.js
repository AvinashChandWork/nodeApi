const appSettings = {
    port: process.env.PORT ?? 4000,
    dbName: process.env.DBNAME ?? '',
    dbPassWord: process.env.DBPASSWORD ?? '',
    dbUserName: process.env.DBUSERNAME ?? '',
    dbHost: process.env.DBHOST ?? '',
    mysqlConnectionLimit: (process.env.MYSQLCONNECTIONLIMIT && parseInt(process.env.MYSQLCONNECTIONLIMIT)) || 400,
    jwtAuthSecret: process.env.JWT_AUTH_SECRET ?? '',
    sentryDSN: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development'
};

export default appSettings;
