const MCP = require("../src/index.js");
const mcp = new MCP();

//Stop
mcp.request.stop().then(function (res) {
    console.log(`Received data`);
    console.log(res);
}).catch(function(error){
    console.log(error.message);
});