(async()=>{
  const MCP = require("../src/index.js");
  const mcp = new MCP({ dev: true });
  const private = '5E844EE4D2E26920F8B0C4B7846929057CFCE48BF40BA269B173648999630053';
  const res =  await mcp.accounts.createByPrivate(123456,private);
  console.log("res",res);

  // generatePublicByPrivate
  const res2 =  await mcp.accounts.getAccountByPrivate(private);
  console.log("res2",res2);

})();