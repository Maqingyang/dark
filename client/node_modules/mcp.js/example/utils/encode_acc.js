const utils = require('../../src/utils/index');
const bs58check = require("bs58check");

function encodeAccount(pub) {
    pub = Buffer.from(pub, "hex");
    console.log(pub);
    const version = Buffer.from([0x01]);
    const v_pub = Buffer.concat([version, pub]);
    return "mcp" + bs58check.encode(v_pub);
}

//B5F327E3F07F2C94DADCDB6D122ADDAFD3AA3AC9507E8F8368F9AD3E6A378798 => mcp4KsqkcZCs6i9VU2WUsiqTU8M6i3WYpVPFMcMXSkKmB92GJvYt1
const acc = utils.encodeAccount("B5F327E3F07F2C94DADCDB6D122ADDAFD3AA3AC9507E8F8368F9AD3E6A378798");

console.log(acc);