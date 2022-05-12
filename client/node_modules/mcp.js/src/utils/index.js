const BigNumber = require('bignumber.js').default;
const Hash = require("./lib/hash");
const decode = require("./helper/decode");
const encode = require("./helper/encode");

const secp256k1 = require('secp256k1');

const { getAddress } = require("./helper/abi-coder/address");
const { arrayify } = require("./helper/abi-coder/convert");

const { keccak256 } = require('js-sha3');
const sha256 = require("js-sha256");

const unitMap = {
    'none': '0',
    'None': '0',
    'can': '1',
    'Can': '1',
    'mcp': '1000000000000000000',
    'MCP': '1000000000000000000',
};

/**
 * Encode an account
 * @param {string} publicKey 
 * @returns {string}
 */
const encodeAccount = function (publicKey) {
    // Zero address, special treatment
    if (
        publicKey ===
        "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    ) {
        return "mcp_zero_address";
    }
    const pub = '0x' + publicKey;
    const newBytes = arrayify(pub);
    const kh = keccak256(newBytes);
    const account = "0x" + kh.substring(24);
    const result = getAddress(account);
    return result;
};

const toUint8Array = (hexString) => {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}
/**
 * Determine whether the input parameter is a string
 * @param {*} obj 
 * @returns {boolean}
 */
const isString = function (obj) {
    return typeof obj === 'string' && obj.constructor === String;
};

/**
 * Determine whether the input parameter is BigNumber
 * @param {*} object 
 * @returns {boolean}
 */
const isBigNumber = function (object) {
    return (object && object.constructor && object.constructor.name === 'BigNumber');
};

/**
 * Number to BigNumber
 * @param {number | BigNumber | string} number 
 * @returns {number | BigNumber} 
 */
const toBigNumber = function (number) {
    number = number || 0;
    if (isBigNumber(number)) {
        return number;
    }
    if (isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
        return new BigNumber(number.replace('0x', ''), 16);
    }
    return new BigNumber(number.toString(10), 10);
};

/**
 * Get the value of the unit
 * @param {string} unit 
 * @returns {BigNumber | Error}
 */
const getValueOfUnit = function (unit) {
    unit = unit ? unit.toLowerCase() : 'mcp';
    const unitValue = unitMap[unit];
    if (unitValue === undefined) {
        throw new Error('This unit doesn\'t exists, please use the one of the following units' + JSON.stringify(unitMap, null, 2));
    }
    return new BigNumber(unitValue, 10);
};

/**
 * 
 * @param {number} number 
 * @param {string} unit 
 * @returns 
 */
const fromCan = function (number, unit) {
    const returnValue = toBigNumber(number).dividedBy(getValueOfUnit(unit));
    return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * 
 * @param {number} number 
 * @param {string} precision 
 * @returns 
 */
const fromCanToken = function (number, precision) {
    const returnValue = toBigNumber(number).dividedBy(precision);
    return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * 
 * @param {number} number 
 * @param {string} unit 
 * @returns 
 */
const toCan = function (number, unit) {
    const returnValue = toBigNumber(number).times(getValueOfUnit(unit));
    return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * 
 * @param {number} number 
 * @param {string} precision 
 * @returns 
 */
const toCanToken = function (number, precision) {
    const returnValue = toBigNumber(number).times(precision);
    return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * Determine whether the account is legal
 * @param {*} act 
 * @returns {boolean}
 */
const isAccount = function (act) {
    if (!act) { return false; }
    return true;
};

/**
 * Determine the data type
 * @param {any} data 
 * @returns 
 */
const judge = function (data) {
    const value = /\[object (\w+)\]/.exec(Object.prototype.toString.call(data));
    return value ? value[1].toLowerCase() : '';
};


/**
 * Handling errors
 * @param {*} error 
 * @param {*} emitter 
 * @param {*} reject 
 * @param {Function} callback 
 * @returns 
 */
const _fireError = function (error, emitter, reject, callback) {
    // add data if given
    if (judge(error) === 'object' && !(error instanceof Error) && error.data) {
        if (judge(error.data) === 'object' || judge(error.data) === 'array') {
            error.data = JSON.stringify(error.data, null, 2);
        }
        error = error.message + "\n" + error.data;
    }
    if (judge(error) === 'string') {
        error = new Error(error);
    }
    if (judge(callback) === 'function') {
        callback(error);
    }
    if (judge(reject) === 'function') {
        if (
            emitter &&
            (judge(emitter.listeners) === 'function' && emitter.listeners('error').length) ||
            (judge(callback) === 'function')
        ) {
            emitter.catch(function () { });
        }
        setTimeout(function () {
            reject(error);
        }, 1);
    }

    if (emitter && judge(emitter.emit) === 'function') {
        // emit later, to be able to return emitter
        setTimeout(function () {
            emitter.emit('error', error);
            emitter.removeAllListeners();
        }, 1);
    }
    return emitter;
};

/**
 * Interface to string
 * @param {*} json 
 * @returns 
 */
const _jsonInterfaceMethodToString = function (json) {
    // Is an object, and has a json name, and is a function
    if (judge(json) === 'object' && json.name && json.name.indexOf('(') !== -1) {
        return json.name;
    }
    return json.name + '(' + _flattenTypes(false, json.inputs).join(',') + ')';
};

/**
 * 
 * @param {*} includeTuple 
 * @param {*} puts 
 * @returns 
 */
const _flattenTypes = function (includeTuple, puts) {
    const types = [];
    puts.forEach(function (param) {
        if (judge(param.components) === 'object') {
            if (param.type.substring(0, 5) !== 'tuple') {
                throw new Error('components found but type is not tuple; report on GitHub');
            }
            let suffix = '';
            const arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) {
                suffix = param.type.substring(arrayBracket);
            }
            const result = _flattenTypes(includeTuple, param.components);
            // console.log("result should have things: " + result)
            // ! TODO error 
            if (judge(param.data) === 'array' && includeTuple) {
                // console.log("include tuple word, and its an array. joining...: " + result.types)
                types.push('tuple(' + result.join(',') + ')' + suffix);
            } else if (!includeTuple) {
                // console.log("don't include tuple, but its an array. joining...: " + result)
                types.push('(' + result.join(',') + ')' + suffix);
            } else {
                // console.log("its a single type within a tuple: " + result.types)
                types.push('(' + result + ')');
            }
        } else {
            // console.log("its a type and not directly in a tuple: " + param.type)
            types.push(param.type);
        }
    });
    return types;
};

const SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
/**
 * 
 * @param {*} value 
 * @returns {string}
 */
const sha3 = function (value) {
    if (isBigNumber(value)) {
        value = value.toString();
    }
    if (isHexStrict(value) && /^0x/i.test((value).toString())) {
        value = hexToBytes(value);
    }
    const returnValue = Hash.keccak256(value); // jshint ignore:line
    if (returnValue === SHA3_NULL_S) {
        return null;
    } else {
        return returnValue;
    }
};
// expose the under the hood keccak256
sha3._Hash = Hash;

/**
 * Check if the string is hexadecimal, 0x is required in front
 * @param {string} hex 
 * @returns {boolean}
 */
const isHexStrict = function (hex) {
    return ((judge(hex) === 'string' || judge(hex) === 'number') && /^(-)?0x[0-9a-f]*$/i.test(hex));
};

/**
 * Convert hexadecimal string to byte array
 * Note: implemented from crypto-js
 * @param {string} hex 
 * @returns {number[]} byte array
 */
const hexToBytes = function (hex) {
    hex = hex.toString(16);
    if (!isHexStrict(hex)) {
        throw new Error('Given value "' + hex + '" is not a valid hex string.');
    }
    hex = hex.replace(/^0x/i, '');
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
};

const sign = function (msg, privateKey) {
    return new Promise(function (resolve, reject) {
        let message = sha256(msg);
        message = toUint8Array(message);
        privateKey = toUint8Array(privateKey);
        const sig = secp256k1.ecdsaSign(message, privateKey);
        const signature =
            Buffer.from(sig.signature, "hex").toString("hex") +
            Buffer.from([sig.recid], "hex").toString("hex");
        resolve(signature);
    });
};

module.exports = {
    isAccount: isAccount,
    _fireError: _fireError,
    _jsonInterfaceMethodToString: _jsonInterfaceMethodToString,

    toBigNumber: toBigNumber,
    isBigNumber: isBigNumber,

    encode: encode,
    decode: decode,
    encodeAccount: encodeAccount,
    fromCan: fromCan,
    fromCanToken: fromCanToken,
    toCan: toCan,
    toCanToken: toCanToken,
    judge: judge,
    sha3: sha3,
    sign: sign
};