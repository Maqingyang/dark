const MCP = require("../src/index.js");
const mcp = new MCP();

console.log(`Start sending request`);
const optAry=[
    "DA71F71426992F11FD342CE728877D776AEC689A46BDD26DB9649B50126E9C1E",
    "970DDA6F7A82FB6F678F00573DA946BCF60A49DBB102B61ECDD5C145F86529AD",
    "5AFB3DE755DB0601B8EC2D48A23566A0578E71BBCCC5084D4554ED3082F32A08"
];
mcp.request.getBlocks(optAry).then(function (res) {
    console.log(`Received data`);
    console.log(res);
}).catch(function(error){
    console.log(`Received Error`,error.message);
});
