const MCP = require("../src/index.js");
const mcp = new MCP();
const hash = "72AB49BF2AA3AA35956659E450F2013BB5D864E6FE025FC9DC365F47500A4046";
console.log(`Start sending request`);
mcp.request.blockTraces(hash).then(function (res) {
    console.log(`Received data`);
    console.log(res);
}).catch(function (error) {
    console.log(`Received Error`, error.message);
});
