import { createPool } from 'mysql2/promise';
import { appSettings } from '../../config/index.js';

const pool = createPool({
    host: appSettings.dbHost,
    user: appSettings.dbUserName,
    password: appSettings.dbPassWord,
    database: appSettings.dbName,
    connectionLimit: appSettings.mysqlConnectionLimit || 10,
    connectTimeout: 60 * 1000,
    waitForConnections: true,
    multipleStatements: true,
});

class DB {
    static async getPoolConnection() {
        try {
            const conn = await pool.getConnection();
            return {
                query: conn.query.bind(conn),
                beginTransaction: conn.beginTransaction.bind(conn),
                commit: conn.commit.bind(conn),
                rollback: conn.rollback.bind(conn),
                release: conn.release.bind(conn),
                conn,
                pool,
            };
        } catch (error) {
            console.error('Error getting DB connection:', error.message);
            throw error;
        }
    }

    static getQuery() {
        return pool.query.bind(pool);
    }
}

export default DB;
