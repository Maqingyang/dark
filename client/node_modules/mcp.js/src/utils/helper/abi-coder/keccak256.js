'use strict';

const sha3 = require('js-sha3');
const convert = require('./convert.js');

/**
 * 
 * @param {*} data 
 * @returns {string}
 */
function keccak256(data) {
    data = convert.arrayify(data);
    return '0x' + sha3.keccak_256(data);
}

module.exports = keccak256;
