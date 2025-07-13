'use strict';

import DB from './db.js';
import { UsersService } from '../v1/services/index.js';

class Users {
    /**
     * Checks if the email and password combination exists in our database or not
     * @param {Object} user - User payload containing email, password and customer_id
     * @returns { Promise<{ token: string, id: number, isNewUser: boolean }> }
     */
    static async findOrCreateUser(user) {
        const { query, release } = await DB.getPoolConnection();
        try {
            const [existingUser] = await query(
                `SELECT email, id, password, token
                FROM users WHERE email = ?`,
                [user.email]
            );
            if (existingUser.length > 0) {
                const userRecord = existingUser[0];
                let password = userRecord.password;
                let savedToken = userRecord.token;
                // Generate and save token if missing
                if (!savedToken || !userRecord.password) {
                    savedToken = UsersService.generateUserToken({ email: user.email });
                }

                let sqlQuery = `
                    UPDATE users 
                    SET token = ?`;

                const params = [savedToken];
                if (user.password) {
                    sqlQuery += ', password = ?';
                    params.push(user.password);
                }

                sqlQuery += ' WHERE id = ?';
                params.push(userRecord.id);

                await query(sqlQuery, params);

                return {
                    savedToken,
                    id: userRecord.id,
                    isNewUser: false,
                };
            }

            const token = await UsersService.generateUserToken({ email: user.email });
            const [insertRes] = await query(
                `INSERT INTO users (email, password, token, name)
                VALUES (?, ?, ?, ?)`,
                [user.email, user.password, token, user.name]
            );

            return {
                token,
                id: insertRes.insertId,
                isNewUser: true,
            };
        } finally {
            release();
        }
    }

    static async getUsers(email = null, name = null) {
        const { query, release } = await DB.getPoolConnection();
        try {
            let sql = `SELECT id, email, name FROM users`;
            const conditions = [];
            const values = [];

            if (email) {
                conditions.push(`email = ?`);
                values.push(email);
            }

            if (name) {
                conditions.push(`name = ?`);
                values.push(name);
            }

            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            const [rows] = await query(sql, values);
            console.log('Fetched users:', rows);
            return rows;
        } catch (err) {
            console.error('Error fetching users:', err.message);
            throw err;
        } finally {
            release();
        }
    }



    static async findUser(email) {
        const { query, release } = await DB.getPoolConnection();
        try {
            const [isUserExist] = await query(
                `SELECT email, id, password, token
                FROM users WHERE email = ?`,
                [email]
            );
            if (isUserExist.length > 0) {
                const [getAllUser] = await query(
                    `SELECT email, password, token
                FROM users`,
                );
            } else {
                return false;
            }
        } catch (err) {
            console.error("Error on fetch user", err.message);
            throw err;
        } finally {
            release();
        }
    };

    static async updateUser(oldEmail, newEmail, name) {
        const { query, release } = await DB.getPoolConnection();
        try {
            console.log('Update input:', { oldEmail, newEmail, name });

            let sql = `UPDATE users SET name = ?`;
            const params = [name];

            // If email is being changed, include it in the query
            if (newEmail && newEmail !== oldEmail) {
                sql += `, email = ?`;
                params.push(newEmail);
            }

            sql += ` WHERE email = ?`;
            params.push(oldEmail);

            const [result] = await query(sql, params);
            let message;
            if (result.affectedRows > 0) {
                message = "User update successfully."
            } else {
                message = "Not able to update."
            }
            return {
                message
            };
        } catch (err) {
            console.error('Error updating user:', err.message);
            throw err;
        } finally {
            release();
        }
    }


}

export default Users;
