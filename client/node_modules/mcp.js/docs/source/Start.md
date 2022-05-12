# Use demo

`mcp.js` is a library for interacting with MPC nodes.

## Install

First, you need to put `mcp.js` into your project.

This can be done using the following methods:

```
npm install mcp
```

After that, you need to start the local MPC node and instantiate `mcp`.

MPC download：<http://dev.mcp.com/download.html>

MPC command line：<https://mcp.readthedocs.io/zh/latest/source/Command-Line-Interfaces.html>

The default port `127.0.0.1:8765`

## Instructions

```js
const MPC = require("mcp");
let mcp = new MCP(); // Use 127.0.0.1:8765 by default

// If you want to modify the port, please set the following
// example
// const options = {
//     host: "127.0.0.1",
//     port: 8888
// };
// let mcp = new MCP(options);

// Now you can use the mcp object
// example
mcp.request.status().then(function (res) {
    console.log(`status`,res);
}).catch(function(error){
    console.log("accountList catch",error)
});
```