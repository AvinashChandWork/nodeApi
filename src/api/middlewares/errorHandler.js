import { ErrorHandler, HttpStatus } from '../utils/index.js';

/**
 * Error handler middleware class.
 */
export default class ErrorHandlerMiddleware {
    /**
     * Checks if the object looks like a CustomError
     * @param {Error} object
     * @returns {boolean}
     */
    static instanceOfCustomError(object) {
        return (
            object &&
            typeof object === 'object' &&
            'format' in object &&
            'statusCode' in object
        );
    }

    /**
     * Express error handling middleware
     * @param {Error} err
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    static handleError = (err, req, res, next) => {
        console.log(err);

        if (ErrorHandlerMiddleware.instanceOfCustomError(err)) {
            return res.status(err.statusCode).json(err.format());
        }

        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(ErrorHandler.logMessage(err));
    };
}
