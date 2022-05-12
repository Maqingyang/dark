import Mcp from "./mcp";

const abi = require("./abi.json");

const McpFunc = new Mcp();

McpFunc.Contract.setProvider("http://18.182.45.18:8765");

//need to substituete
const tokenAddress = "0xa9DDe3026edE84b767205492Eef2944E1FC3a0B8";
const coreAddress = "0x1D8b22d407c2b4C0bEdDc4D818AF32948BC3a6B9";

const Instance = new McpFunc.Contract(
    abi,
    tokenAddress
);

const Contract = {
    tokenAddress,
    Instance,
    coreAddress
};

export default Contract;