const MCP = require("../src/index.js");
const mcp = new MCP({
    host:'192.168.2.106'
});

mcp.request.status().then(function (res) {
    console.log(`status`,res);
}).catch(function(error){
    console.log("accountList catch",error);
});

mcp.request.mciBlocks("1").then(function (res) {
    console.log(`mciBlocks`,res);
}).catch(function(error){
    console.log("accountList catch",error);
});

mcp.request.unstableBlocks().then(function (res) {
    console.log(`unstableBlocks`,res);
}).catch(function(error){
    console.log("accountList catch",error);
});