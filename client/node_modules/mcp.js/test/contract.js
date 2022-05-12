const Mcp = require("../src/index.js");
const abi = require("./abi.json");

const contractAddress = "0x1085466ced448624e119e7a03ec1ccbae810a9eb"

const McpFunc = new Mcp({
    host: "18.182.45.18",
    port: 8765
});

McpFunc.Contract.setProvider("http://18.182.45.18:8765");

const myContract = new McpFunc.Contract(abi, contractAddress);

describe("Contract", function () {
    describe('#balanceOf: ', function () {
        it("should not return error", function (done) {
            const account = "0x6ea25c8e3003024dff4bbe035cf9f7c36966b25e";
            myContract.methods.balanceOf(account).call().then(res => {
                done();
            })
        })
    })
})