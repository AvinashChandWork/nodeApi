import jwt from 'jsonwebtoken';
import { HttpStatus } from '../../utils/index.js';
import { Users } from '../../db/index.js';
import { appSettings } from '../../../config/index.js';

/**
 * Users service to provide user-level services
 */
export default class UsersService {
    /**
     * Service used to log in the user
     * @param {Object} user - User payload containing email, password, and customer_id
     * @returns {Promise<{ status: number, body: { success: boolean, data: { email: string, password: string, name: string } } }>}
     */
    static handleUserAuthentication = async (user) => {
        const okPacket = await Users.findOrCreateUser(user);

        if (!okPacket?.token) {
            // throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
        }

        return {
            status: okPacket.isNewUser ? HttpStatus.CREATED : HttpStatus.OK,
            body: {
                success: true,
                data: {
                    token: okPacket.token,
                },
            },
        };
    };

    static generateUserToken = async (email) => {
        const token = jwt.sign(email, appSettings.jwtAuthSecret);
        return token;
    };

    static deCodeJWTToken = async (token) => {
        const email = jwt.verify(token, appSettings.jwtAuthSecret);
        return email;
    }

    static getUsers = async (token, email, name) => {
        const varifyEmail = jwt.verify(token, appSettings.jwtAuthSecret);

        const okPacket = await Users.getUsers(email, name);
        if (!okPacket?.token) {
            // throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
        }

        return {
            status: HttpStatus.OK,
            body: {
                success: true,
                data: okPacket,
            },
        };
    };

    static updateUser = async (token, oldEmail, newEmail, name) => {
        const varifyEmail = jwt.verify(token, appSettings.jwtAuthSecret);
        const okPacket = await Users.updateUser(oldEmail, newEmail, name);
        if (!okPacket?.token) {
            // throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
        }

        return {
            status: HttpStatus.OK,
            body: {
                success: true,
                data: okPacket,
            },
        };
    };
}
