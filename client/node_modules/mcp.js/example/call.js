(async () => {
    const MCP = require("../src/index.js");
    const mcp = new MCP();
    // call
    const arg1 = {
        "from": "mcp2xw7Js5yqHGLwbURWd25Ed6TXDtiftDd5qbBsuvq1rg9ZkpyC8",
        "to": "mcp4tQcxDipZuAfteKuDcf4FeaYbmpoHubS2XvfWKS1VhrghjgCvb",
        "data": "4aa65bd7",
        "mci":"1"
    };
    const res = await mcp.request.call(arg1);
    console.log(`Received data`);
    console.log(res);
    // console.log(mcp.utils.decode.name(res.output));
})();