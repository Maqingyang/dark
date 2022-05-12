// solc
const path = require('path');
const fs = require('fs');
const solc = require('czr-solc'); //You need to install it manually when you use it
const srcpath = path.resolve(__dirname, 'sources', 'test.sol');
const source = fs.readFileSync(srcpath, 'utf-8');
const input = {
    "language": 'Solidity',
    "sources": {
        'test1.sol': {
            "content": source
        }
    },
    "settings": {
        "optimizer": {
            "enabled": true,
            "runs": 200
        },
        "outputSelection": {
            '*': {
                '': ['legacyAST'],
                '*': ['abi', 'metadata', 'devdoc', 'userdoc', 'evm.legacyAssembly', 'evm.bytecode', 'evm.deployedBytecode', 'evm.methodIdentifiers', 'evm.gasEstimates']
            }
        }
    }
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));

const bytecode = output.contracts['test1.sol']['Web3Test'].evm.bytecode.object;
const interfaceFile = output.contracts['test1.sol']['Web3Test']['abi'];

// console.log("contractByteCode :", contractByteCode)
// console.log("methodIdentifiers :", methodIdentifiers)
// console.log("abi :", abi)
//End

// let Contract = require('../../src/contract/index');
const MCP = require("../../src/index.js");
const mcp = new MCP();

const mcpUrl = 'http://127.0.0.1:8765/';
let curAccount = '';
let myContract = {};
const config = {
    mcp: function () {
        curAccount = 'mcp4oYDBFVLtPCpJe8uJ7nZ7owGmUrKqoCrRvkc3kHrugabuPbvg9';
        mcp.Contract.setProvider(mcpUrl);
        myContract = new mcp.Contract(interfaceFile, curAccount, {
            from: 'mcp3wzg2dsCPBMDAtbTATPPmyqqcUvH3GCbeEeEJmekCQZuwQE2xx',
            gas: 2000000,
            gas_price: '1000000000'
        });
    }
};
config.mcp();

console.log("demo start");

const utility = {
    init() {
        // utility.prop();
        // utility.clone();

        // Step zero
        // utility.allMethods();

        //first step
        utility.testSend1();

        //Second step
        // utility.testCall1();

        //third step
        // utility.testSend2();

        //the fourth step
        // utility.testCall2()

        //send
        // utility.onlyDeploy();
        // utility.deploy1();
        // utility.testEvent();
        // utility.EventTest();
    },
    prop() {
        console.log('------Attributes-----');
        console.log(`myContract.options`, myContract.options);
        console.log(`Initial address: ${myContract.options.account}`);
        console.log(`JSON interface:`, myContract.options.jsonInterface.length);//Calculate hash

        //Annotation
        // myContract.options.account = '0xc608d3853748c8E178A0803Bc6061C466B2F3c57'
        // console.log(`Change address: ${myContract.options.account}`);
        // utility.clone();
    },

    //abi
    allMethods() {
        console.log("----- allMethods -----");
        console.log(myContract.methods);
        console.log("----- allMethods -----");

        console.log('\n\n\n');
        console.log('------encodeABI-----');
        console.log(`testCall1: ${myContract.methods.testCall1().encodeABI()}`);
        const encodeABIData = myContract.methods.testSend2(200, 201).encodeABI();
        console.log(`testSend2: ${encodeABIData}`);
        console.log('------encodeABI-----');
    },

    //call
    testCall1() {
        console.log('------testCall1-----');
        myContract.methods.testCall1().call(function (error, result) {
            console.log("Call1 start------ ");
            console.log(error);
            console.log(result);
            console.log("Call1 end------ ");
        }).then(data => {
            console.log('Call1 data', data);
            console.log('------testCall1-----');
        }).catch(function (error) {
            console.log('Call1 catch error', error);
        });
    },
    testCall2() {
        console.log('------testCall2-----');
        myContract.methods.testCall2(0, 1).call(function (error, result) {
            console.log("Call2 start------ ");
            console.log(error);
            console.log(result);
            console.log("Call2 start------ ");
        }).then(data => {
            console.log('Call2 data', data);
            console.log('------testCall2-----');
        }).catch(function (error) {
            console.log('Call2 catch error', error);
        });
    },
    //************************************* */
    onlyDeploy() {
        try {
            const cccc = myContract.deploy({ data: bytecode });
            console.log("cccc");
            console.log(cccc);
        } catch (error) {
            console.log("catch error");
            console.log(error);
        }
    },
    deploy1() {
        myContract.deploy({
            data: bytecode
        })
            .sendBlock({
                password: '12345678',
                amount: "0"
            }, function (error, transactionHash) {
                console.log("deploy callback");
                console.log("error ==> ", error);
                console.log("transactionHash ==> ", transactionHash);
            })
            .then(function (res) {
                console.log(res);
            })
            .catch(function (error) {
                console.log('catch', error);
            });
    },
    testSend1() {
        console.log("----- testSend1 -----");
        myContract.methods.testSend1()
            .sendBlock({
                amount: "0",
                password: '12345678',
            }, function (error, transactionHash) {
                console.log("callback");
                console.log("error ==> ", error);
                console.log("transactionHash ==> ", transactionHash);
            })
            .then(function (newContractInstance) {
                console.log('New contract instance');
                console.log(newContractInstance); // instance with the new contract account
                console.log("----- testSend1 -----");
            }).catch(error => {
                console.log("catch");
                console.log(error);
            });

    },
    testSend2() {
        console.log("----- testSend2 -----");
        myContract.methods.testSend2(110, 119)
            .sendBlock(
                {
                    amount: "0",
                    password: '12345678',
                },
                function (error, transactionHash) {
                    console.log("callback");
                    console.log("error ==> ", error);
                    console.log("transactionHash ==> ", transactionHash);
                }
            )
            .then(data => {
                console.log('testSend2 data', data);
                console.log("----- testSend2 -----");
            }).catch(function (error) {
                console.log('testSend2 error', error);
            });
    },
    testEvent() {
        console.log("----- testEvent -----");
        myContract.methods.testEvent()
            .sendBlock(
                {
                    amount: "0",
                    password: '12345678',
                }
            )
            .then(data => {
                console.log('testEvent data', data);
                console.log("----- testEvent -----");
            }).catch(function (error) {
                console.log('testEvent error', error);
            });
    },
    clone() {
        console.log("\n Prepare to use the clone method------------------------------ ");
        const myContract2 = myContract.clone();
        myContract2.options.account = '0xXXXXXXXXXXXXXXXXXXXXXX';
        console.log(`Initial address:${myContract.options.account}`);
        console.log(`Clone address:${myContract2.options.account}`);
    },

    //Event
    EventTest() {
        console.log("----- EventTest -----");
        myContract.getPastEvents('EventTest', {
            from_stable_block_index: 0
        })
            .then(function (events) {
                console.log("received");
                console.log(events); // same results as the optional callback above
                console.log("----- EventTest -----");
            });

    }
};
utility.init();