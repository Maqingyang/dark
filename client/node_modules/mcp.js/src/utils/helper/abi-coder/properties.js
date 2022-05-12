'use strict';

/**
 * 
 * @param {*} object 
 * @param {*} name 
 * @param {*} value 
 */
function defineProperty(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}

/**
 * 
 * @param {*} object 
 * @param {*} name 
 * @param {*} value 
 */
function defineFrozen(object, name, value) {
    const frozen = JSON.stringify(value);
    Object.defineProperty(object, name, {
        enumerable: true,
        get: function() { return JSON.parse(frozen); }
    });
}

module.exports = {
    defineFrozen: defineFrozen,
    defineProperty: defineProperty,
};
