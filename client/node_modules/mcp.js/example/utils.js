const MCP = require("../src/index.js");
const mcp = new MCP();
const mcpVal = 2;
//toCan
console.log(`${mcpVal}MCP toCan result  => ${mcp.utils.toCan(mcpVal, "mcp")}`);
console.log(`${mcpVal}MCP toCanToken result  => ${mcp.utils.toCanToken(mcpVal, 1000000000000000000)}`);

//fromCan
console.log(`${mcpVal}MCP fromCan result  => ${mcp.utils.fromCan(mcpVal)}`);
console.log(`${mcpVal}MCP fromCanToken result  => ${mcp.utils.fromCanToken(mcpVal, 1000000000000000000)}`);

//toBigNumber
const bigVal = mcp.utils.toBigNumber(mcpVal);
console.log(`${mcpVal} toBigNumber result  => bigVal`, bigVal);

//isBigNumber
console.log(`${bigVal} toBigNumber result  => ${mcp.utils.isBigNumber(bigVal)}`);
console.log(`${mcpVal} toBigNumber result  => ${mcp.utils.isBigNumber(mcpVal)}`);

//ACCOUNT
console.log(' ******************* Account Start ******************* ');
console.log(mcp.utils.encodeAccount('B5F327E3F07F2C94DADCDB6D122ADDAFD3AA3AC9507E8F8368F9AD3E6A378798'));
console.log(mcp.utils.encodeAccount('22'));
console.log(mcp.utils.decodeAccount('mcp4q4ziHqw2N8ZsTuCpecS4D91tZdDEbJjiskV27LBK8E5LWNsxz'));
try {
    console.log(mcp.utils.decodeAccount('mcpZkhY9fA'));
} catch (error) {
    console.log(error);
}
console.log(' ******************* Account End ******************* ');