import jwt from 'jsonwebtoken';
// import axios from 'axios';
import { ErrorHandler, HttpStatus } from '../utils/index.js';
import { Users } from '../db/index.js';
import { appSettings } from '../../config/index.js';

export default class AuthenticateMiddleware {
    /**
     * Middleware used to validate the admin user if it follows all rules
     *
     * @param {import('express').Request} req - Express Request
     * @param {import('express').Response} res - Express Response
     * @param {import('express').NextFunction} next - Express NextFunction
     */
    static verifyAdmin = async (req, res, next) => {
        const auth_username = req.currentUser?.email;
        const roleIds = [3, 12, 28, 21, 20, 14, 13, 19, 30];

        try {
            const response = await axios.get(`${appSettings.enSwitchApi}user/login/`, {
                params: {
                    auth_username,
                    auth_password: req.currentUser?.auth_password,
                },
            });

            if (
                !response?.data?.data ||
                !response?.data?.data?.role ||
                response?.data?.data?.username !== auth_username
            ) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json(ErrorHandler.formateErrorResponse('User role or identity is invalid.'));
            }

            if (!roleIds.includes(Number(response?.data?.data?.role))) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json(ErrorHandler.formateErrorResponse('User is not an admin'));
            }

            return next();
        } catch (error) {
            return res.status(403).json({ message: 'Forbidden: Invalid credentials' });
        }
    };
}
