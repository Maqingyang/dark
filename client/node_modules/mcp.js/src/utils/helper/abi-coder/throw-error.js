'use strict';

/**
 * 
 * @param {*} message 
 * @param {*} params 
 */
function throwError(message, params) {
    const error = new Error(message);
    for (const key in params) {
        error[key] = params[key];
    }
    throw error;
}

module.exports = throwError;
