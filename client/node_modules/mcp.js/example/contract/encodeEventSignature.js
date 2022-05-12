const MCP = require("../../src/index.js");
const mcp = new MCP();

const sign1 = mcp.abi.encodeEventSignature('myEvent(uint256,bytes32)');

const opt2 = {
    name: 'myEvent',
    type: 'event',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'bytes32',
        name: 'myBytes'
    }]
};

const opt3 = {
    name: 'myEvent',
    type: 'event',
    inputs: [{
        type: 'uint256'
    }, {
        type: 'bytes32'
    }]
};

const sign2 = mcp.abi.encodeEventSignature(opt2);
const sign3 = mcp.abi.encodeEventSignature(opt3);


console.log(sign1);
console.log(sign2);
console.log(sign3);