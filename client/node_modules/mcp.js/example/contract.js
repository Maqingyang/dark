const MCP = require("../src/index.js");
const mcp = new MCP();

console.log(`Start sending request`);

// estimateGas
const opt1 = {
    "action": "estimate_gas",
    "from": "mcp4sjcWhaYGjNhQM8RWKwXzYUfKa476Yij8iW556GyYvDu118g3j",
    "to": "mcp3gustGDwMtuUTn1iJHBwRYXCBNF51dRixXNeumWDwZLvH43J3d",
    "amount": "1000000000000000000",
    "password": "12345678",
    "gas": 1000,
    "gas_price": "1000000000000",
    "data": "496E204D617468205765205472757374"
};

const opt2 = {
    "action": "estimate_gas",
    // "from": "mcp4sjcWhaYGjNhQM8RWKwXzYUfKa476Yij8iW556GyYvDu118g3j",
    // "to": "mcp3gustGDwMtuUTn1iJHBwRYXCBNF51dRixXNeumWDwZLvH43J3d",
    // "amount": "1000000000000000000",
    // "password": "12345678",
    "gas": 1000,
    "gas_price": "1000000000000",
    // "data": "496E204D617468205765205472757374"
};

mcp.request.estimateGas(opt1).then(function (res) {
    console.log(`Received data`);
    console.log(res);
}).catch(function (error) {
    console.log(`Received Error`, error.message);
});

// call
const arg1 = {
    "from": "mcp4kYTyZTjRGQoEioCbT8JcKpDaqjJs2ekpxcucTC14SniuNABi6",
    "to": "mcp3KfLt664eysPMc5pp1wTiRQhYELXM7EruDVoEPYWM4bmZRDZJq",
    "data": "0x0dbe671f"
};
mcp.request.call(arg1).then(function (res) {
    console.log(`Received data`);
    console.log(res);
}).catch(function (error) {
    console.log(`Received Error`, error.message);
});
