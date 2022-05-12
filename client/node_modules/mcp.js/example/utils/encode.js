const utils = require('../../src/utils/index');
// const decode = require('../../src/utils/helper/decode');

const parm = {
    functionName: "constructor",
    args: ["1000000000000000000000000000", "mcp", "MCP"]
};
const data = utils.encode.parse(parm);

console.log("********************* data **********************");
console.log(data);

// let callParams = {
//     to: contractAddress,
//     functionName: "balanceOf",
//     args: [contractAddress]
// }
// let data2 = utils.encode.parse(callParams);
// console.log("********************* data **********************");
// console.log(callParams);