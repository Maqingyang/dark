const bs58check = require("bs58check");

function encodeAccount(pub_ads) {
    const pub = Buffer.from(pub_ads, "hex");
    const version = Buffer.from([0x01]);
    const v_pub = Buffer.concat([version, pub]);
    return "mcp" + bs58check.encode(v_pub);
}

function decodeAccount(mcpAddress) {
    const res = mcpAddress.split("_");
    if (!res[1]) {
        throw Error(`mcp account (${mcpAddress}) format error.`);
    }
    const bytecode = bs58check.decode(res[1]);
    return bytecode.toString("hex").substring(2).toUpperCase();
}

console.log(encodeAccount('B5F327E3F07F2C94DADCDB6D122ADDAFD3AA3AC9507E8F8368F9AD3E6A378798'));
console.log(encodeAccount('22'));

console.log('*******************');
console.log(decodeAccount('mcp4KsqkcZCs6i9VU2WUsiqTU8M6i3WYpVPFMcMXSkKmB92GJvYt1'));
console.log(decodeAccount('22'));