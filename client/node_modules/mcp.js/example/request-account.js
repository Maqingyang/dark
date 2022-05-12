
const MCP = require('../src/index');
const mcp = new MCP();

/**
 * Get all accounts of the current node
 * */
mcp.request.accountList()
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Generate account
 * */
mcp.request.accountCreate('12345678')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Delete account
 * */
mcp.request.accountRemove('mcp2xw7Js5yqHGLwbURWd25Ed6TXDtiftDd5qbBsuvq1rg9ZkpyC8','12345678')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Locked account
 * */
mcp.request.accountLock('mcp3RwsLMiNHFEd6YgdXZAbPG7ZNDsQKTD85YYzwH14iPF1fyzbhm')
.then(ret => {
    if (ret.code === 0) {
        console.log('request success =>', ret);
    } else {
        console.log('request failed =>', ret);
    }
})
.catch(err => console.log);

/**
 * Unlock account
 * */
mcp.request.accountUnlock('mcp3RwsLMiNHFEd6YgdXZAbPG7ZNDsQKTD85YYzwH14iPF1fyzbhm','12345678')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Export account
 * */
mcp.request.accountExport('mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/* '{"account":"mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV","kdf_salt":"FF85E88996150C89517F5DDD30AAC4EE","iv":"A0B298BD7F406B0399E269A7B412F81E","ciphertext":"801A36BBF281D4C8D9B5067AD32C97AD20C48B20AEA48C50496A27A89B8AB23E"}' */
/**
 * Import account
 * */
mcp.request.accountImport('{"account":"mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV","kdf_salt":"FF85E88996150C89517F5DDD30AAC4EE","iv":"A0B298BD7F406B0399E269A7B412F81E","ciphertext":"801A36BBF281D4C8D9B5067AD32C97AD20C48B20AEA48C50496A27A89B8AB23E"}')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request accountImport success =>', ret);
        } else {
            console.log('request accountImport failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Verify that the account format is legal
 * accountValidate
 * */
mcp.request.accountValidate('mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * change Password
 * accountChangePwd
 * */
mcp.request.accountChangePwd('mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV','12345678','87654321')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get transaction details of a specified account
 * accountBlockList
 * */
mcp.request.accountBlockList('mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get the specified account balance
 * accountBalance
 * */
mcp.request.accountBalance('mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get the balance of multiple accounts
 * accountsBalances
 * */
mcp.request.accountsBalances(['mcp4LVKLFw7RgagEPCZJVw86GYsQsFny3kAzBRF4BVhGvigdtEvrV','mcp3cMjWUPrcputvcyqD6XiMz5oSfAwBJF8g8wU65cquAfDAxzci3'])
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Return the compiled smart contract code for the given address (if any)
 * accountCode
 */
mcp.request.accountCode("mcp3cMjWUPrcputvcyqD6XiMz5oSfAwBJF8g8wU65cquAfDAxzci3")
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);
