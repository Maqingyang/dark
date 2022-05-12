const MCP = require("../src/index.js");
const mcp = new MCP();

const mci = 0;
const LIMIT = 50;
let next_index = '';

function getMciBlocks(){
    console.log("Start sending request");
    mcp.request.mciBlocks(mci,LIMIT, next_index).then(function (res) {
        console.log(`Received data`);
        console.log(res);
        if(res.next_index){
            next_index = res.next_index;
            // Loop again
            getMciBlocks();
        }else{
            // The current MCIblocks has been taken out
        }
    }).catch(function(error){
        console.log(`Received Error`,error.message);
    });
}
getMciBlocks();
