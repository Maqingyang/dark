const MCP = require("../src/index.js");
const mcp = new MCP({
    dev: false,
    host: "127.0.0.1",
    port: 8765
});

const now = new Date();
console.log(now.getFullYear(), (now.getMonth() + 1), now.getDate(), " : ", now.getHours(), now.getMinutes(), now.getSeconds());

// const opt ={ action: 'accounts_balances',
//     accounts:
//         [ 'mcp1hd95bfoitkgbykr9rrnirfmz4fpew1z3a73u33npfa9jdxen37oopagsjrc',
//             'mcp19rw6416uie15u9qfiyt8s8wr5zjac57c1gmb3bdrz1bo4dgm8gm3quwgrfg',
//             'mcp1957k75m9y9ec6n38mhbgaawqy19meoi6f5uzpx6eb4auhzh88gc9gtbyr78' ] };
// mcp.request.accountsBalances(opt).then(function (res) {
//     console.log(res);
// }).catch(function(error){
//     console.log("accountValidate catch",error)
// });

let timer = null;
let falg = 0;
const pageUtility = {
    runTimer: function () {
        falg++;
        console.log(`Restart timer,${falg}`);
        timer = setTimeout(function () {
            pageUtility.getList();
        }, 10);
    },
    getList: function () {
        console.log(`Start sending request`);
        mcp.request.accountList().then(function (res) {
            console.log(`Received data`);
            pageUtility.runTimer();
        }).catch(function (error) {
            console.log("Received Error", error);
        });
    }
};
pageUtility.runTimer();
