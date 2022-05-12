const MCP = require("../src/index.js");
const mcp = new MCP();

console.log(`Start sending request`);
mcp.request.accountList().then(function (res) {
    console.log(`Received data`);
    console.log(res);
    /*
    { accounts:
       [ 'mcp2xw7Js5yqHGLwbURWd25Ed6TXDtiftDd5qbBsuvq1rg9ZkpyC8',
        'mcp3RwsLMiNHFEd6YgdXZAbPG7ZNDsQKTD85YYzwH14iPF1fyzbhm',
        'mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV',
        'mcp3cMjWUPrcputvcyqD6XiMz5oSfAwBJF8g8wU65cquAfDAxzci3',
        'mcp3tBZy9htJsSRx73rjShsEQjbRd3pSZKGTWmk7wobDUHMncAXAJ',
        'mcp47QW9NMx4BFnxibaDEkLiUFFUducCWrKQQaoF4abzniV9zLrMD',
        'mcp4swShBy9MzvFuE1nvNggTyCmMcLpUD96G8aNuSWXUgpTE6DT7x',
        'mcp49d9JWoqGTJy1X14o3YetmHc6poPDhhdjwrestz3X5HaMaG34K',
        'mcp4oYDBFVLtPCpJe8uJ7nZ7owGmUrKqoCrRvkc3kHrugabuPbvg9' ]
     }
    */
}).catch(function(error){
    console.log(`Received Error`,error.message);
});

