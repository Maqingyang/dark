/**
 *  Conversion Utilities
 *
 */

var defineProperty = require('./properties.js').defineProperty;

var errors = require('./errors');

/**
 * 
 * @param {*} value 
 * @returns 
 */
 function isBigNumber(value) {
    return (value instanceof types_1.BigNumber);
}

function isHexable(value) {
    return !!(value.toHexString);
}
function addSlice(array) {
    if (array.slice) {
        return array;
    }
    array.slice = function () {
        const args = Array.prototype.slice.call(arguments);
        return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
    };
    return array;
}

/**
 * 
 * @param {*} array 
 * @returns 
 */
function addSlice(array) {
    if (array.slice) {
        return array;
    }
    array.slice = function () {
        var args = Array.prototype.slice.call(arguments);
        return new Uint8Array(Array.prototype.slice.apply(array, args));
    };
    return array;
}

/**
 * 
 * @param {*} value 
 * @returns 
 */
function isArrayish(value) {
    if (!value || parseInt(String(value.length)) != value.length || typeof (value) === 'string') {
        return false;
    }
    for (var i = 0; i < value.length; i++) {
        var v = value[i];
        if (v < 0 || v >= 256 || parseInt(String(v)) != v) {
            return false;
        }
    }
    return true;
}
exports.isArrayish = isArrayish;

function isInteger(value) {
    return (typeof (value) === "number" && value == value && (value % 1) === 0);
}
function isBytes(value) {
    if (value == null) {
        return false;
    }
    if (value.constructor === Uint8Array) {
        return true;
    }
    if (typeof (value) === "string") {
        return false;
    }
    if (!isInteger(value.length) || value.length < 0) {
        return false;
    }
    for (let i = 0; i < value.length; i++) {
        const v = value[i];
        if (!isInteger(v) || v < 0 || v >= 256) {
            return false;
        }
    }
    return true;
}
/**
 * 
 * @param {*} value 
 * @returns {boolean}
 */
function isArrayish(value) {
    if (!value || parseInt(value.length) != value.length || typeof (value) === 'string') {
        return false;
    }

    for (var i = 0; i < value.length; i++) {
        var v = value[i];
        if (v < 0 || v >= 256 || parseInt(v) != v) {
            return false;
        }
    }

    return true;
}

/**
 * 
 * @param {*} value 
 * @returns {array}
 */
function arrayify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof (value) === "number") {
        // logger.checkSafeUint53(value, "invalid arrayify value");
        const result = [];
        while (value) {
            result.unshift(value & 0xff);
            value = parseInt(String(value / 256));
        }
        if (result.length === 0) {
            result.push(0);
        }
        return addSlice(new Uint8Array(result));
    }
    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        value = value.toHexString();
    }
    if (isHexString(value)) {
        let hex = value.substring(2);
        if (hex.length % 2) {
            if (options.hexPad === "left") {
                hex = "0x0" + hex.substring(2);
            }
            else if (options.hexPad === "right") {
                hex += "0";
            }
            else {
                errors.throwError("hex data is odd-length", "value", value);
            }
        }
        const result = [];
        for (let i = 0; i < hex.length; i += 2) {
            result.push(parseInt(hex.substring(i, i + 2), 16));
        }
        return addSlice(new Uint8Array(result));
    }
    if (isBytes(value)) {
        return addSlice(new Uint8Array(value));
    }
    return errors.throwError("invalid arrayify value", "value", value);
}

/**
 * 
 * @param {array} objects 
 * @returns {array}
 */
function concat(objects) {
    var arrays = [];
    var length = 0;
    for (let i = 0; i < objects.length; i++) {
        var object = arrayify(objects[i]);
        arrays.push(object);
        length += object.length;
    }

    var result = new Uint8Array(length);
    var offset = 0;
    for (let i = 0; i < arrays.length; i++) {
        result.set(arrays[i], offset);
        offset += arrays[i].length;
    }

    return addSlice(result);
}

/**
 * 
 * @param {*} value 
 * @returns 
 */
function stripZeros(value) {
    value = arrayify(value);

    if (value.length === 0) { return value; }

    // Find the first non-zero entry
    var start = 0;
    while (value[start] === 0) { start++; }

    // If we started with zeros, strip them
    if (start) {
        value = value.slice(start);
    }

    return value;
}

/**
 * 
 * @param {*} value 
 * @param {*} length 
 * @returns {array}
 */
function padZeros(value, length) {
    value = arrayify(value);

    if (length < value.length) { throw new Error('cannot pad'); }

    var result = new Uint8Array(length);
    result.set(value, length - value.length);
    return addSlice(result);
}

/**
 * 
 * @param {*} value 
 * @param {*} length 
 * @returns {boolean}
 */
function isHexString(value, length) {
    if (typeof (value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && value.length !== 2 + 2 * length) { return false; }
    return true;
}

var HexCharacters = '0123456789abcdef';

/**
 * 
 * @param {*} value 
 * @returns 
 */
function hexlify(value) {

    if (value && value.toHexString) {
        return value.toHexString();
    }

    if (typeof (value) === 'number') {
        if (value < 0) {
            errors.throwError('cannot hexlify negative value', errors.INVALID_ARG, { arg: 'value', value: value });
        }

        var hex = '';
        while (value) {
            hex = HexCharacters[value & 0x0f] + hex;
            value = parseInt(value / 16);
        }

        if (hex.length) {
            if (hex.length % 2) { hex = '0' + hex; }
            return '0x' + hex;
        }

        return '0x00';
    }

    if (isHexString(value)) {
        if (value.length % 2) {
            value = '0x0' + value.substring(2);
        }
        return value;
    }

    if (isArrayish(value)) {
        var result = [];
        for (var i = 0; i < value.length; i++) {
            var v = value[i];
            result.push(HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f]);
        }
        return '0x' + result.join('');
    }

    errors.throwError('invalid hexlify value', { arg: 'value', value: value });
}

/**
 * 
 * @param {*} value 
 * @returns 
 */
function hexStripZeros(value) {
    while (value.length > 3 && value.substring(0, 3) === '0x0') {
        value = '0x' + value.substring(3);
    }
    return value;
}

/**
 * 
 * @param {*} value 
 * @param {*} length 
 * @returns 
 */
function hexZeroPad(value, length) {
    while (value.length < 2 * length + 2) {
        value = '0x0' + value.substring(2);
    }
    return value;
}

/* @TODO: Add something like this to make slicing code easier to understand
function hexSlice(hex, start, end) {
    hex = hexlify(hex);
    return '0x' + hex.substring(2 + start * 2, 2 + end * 2);
}
*/
/**
 * 
 * @param {*} signature 
 * @returns 
 */
function splitSignature(signature) {
    signature = arrayify(signature);
    if (signature.length !== 65) {
        throw new Error('invalid signature');
    }

    var v = signature[64];
    if (v !== 27 && v !== 28) {
        v = 27 + (v % 2);
    }

    return {
        r: hexlify(signature.slice(0, 32)),
        s: hexlify(signature.slice(32, 64)),
        v: v
    };
}

module.exports = {
    arrayify: arrayify,
    isArrayish: isArrayish,

    concat: concat,

    padZeros: padZeros,
    stripZeros: stripZeros,

    splitSignature: splitSignature,

    hexlify: hexlify,
    isHexString: isHexString,
    hexStripZeros: hexStripZeros,
    hexZeroPad: hexZeroPad,
};
