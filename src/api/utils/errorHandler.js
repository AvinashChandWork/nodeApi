'use strict';

/***
 * Error handler class used to handle error messages
 */
class ErrorHandler {
    /**
     * Format the error message and returns an object with success and message
     *
     * @param {string} message
     * @returns {{ success: boolean, message: string }}
     */
    static formateErrorResponse = (message) => {
        return {
            success: false,
            message: message,
        };
    };

    /**
     * Method used to log the message and return formatted error response
     * @param {*} ex - Exception which we want to log and format
     * @param {boolean} [pushToThirdParty = true]
     * @param {string} [loglevel = 'error']
     * @returns {{ success: boolean, message: string }}
     */
    static logMessage = (ex, pushToThirdParty = true, loglevel = 'error') => {
        let message = 'Something went wrong';
        if (typeof ex === 'string') {
            message = ex;
        } else if (ex instanceof Error) {
            message = ex.message;
        }

        // if (pushToThirdParty) {
        //     if (loglevel !== 'error') {
        //         captureMessage(message, loglevel);
        //     } else {
        //         captureException(ex);
        //     }
        // }

        // eslint-disable-next-line no-console
        console.log(message);

        return this.formateErrorResponse(message);
    };

    /**
     * Method used to handle errors in centralized location
     * @param {function} fn - Controller handler function
     * @returns {function}
     */
    static wrapTryCatch = (fn) => {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    };
}

export default ErrorHandler;
