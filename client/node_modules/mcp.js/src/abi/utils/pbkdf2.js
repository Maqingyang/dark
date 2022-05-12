'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var bytes_1 = require("./bytes");

/**
 * 
 * @param {*} value 
 * @returns 
 */
function bufferify(value) {
    return Buffer.from(bytes_1.arrayify(value));
}

/**
 * 
 * @param {*} password 
 * @param {*} salt 
 * @param {*} iterations 
 * @param {*} keylen 
 * @param {*} hashAlgorithm 
 * @returns 
 */
function pbkdf2(password, salt, iterations, keylen, hashAlgorithm) {
    return bytes_1.arrayify(crypto_1.pbkdf2Sync(bufferify(password), bufferify(salt), iterations, keylen, hashAlgorithm));
}
exports.pbkdf2 = pbkdf2;
