const assert = require('assert');
const expect = require('chai').expect;

const DEV = true;

const MCP = require("../src/index.js");
const mcp = new MCP({
    dev: DEV
});
