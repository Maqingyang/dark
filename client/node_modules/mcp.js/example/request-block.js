const MCP = require('../src/index');
const mcp = new MCP();

/**
 * version
 * */
mcp.request.version()
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get all accounts of the current node
 * */
mcp.request.accountList()
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret, '\n');
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Send transaction
 * sendBlock
 * */
mcp.request.sendBlock({
    "from": "mcp4M3zGYDwWVkhsoP1FxMiuaKyRtc2wQFUDchbMQCkW2q2UmwroX",
    "to": "mcp4XeMPvNwNbJPruZJdrMQLEJpng22QaPDbNFcrKpdLxEewEPZQT",
    "amount": '0',
    "password": "12345678",
    "gas": '0',
    "data": ""
})
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Generate unsigned transaction, return transaction details
 * generateOfflineBlock
 * */
mcp.request.generateOfflineBlock({
    from: 'mcp4M3zGYDwWVkhsoP1FxMiuaKyRtc2wQFUDchbMQCkW2q2UmwroX',
    to: 'mcp4XeMPvNwNbJPruZJdrMQLEJpng22QaPDbNFcrKpdLxEewEPZQT',
    amount: '0',
    gas: '0',
})
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Signed message
 * signMsg
 * */
mcp.request.signMsg('mcp4M3zGYDwWVkhsoP1FxMiuaKyRtc2wQFUDchbMQCkW2q2UmwroX', '12345678', 'F310B56BABE79E8F6DFDE423EA261132F9901D0394070237307A10FFC2BBB06A')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Send signed transaction
 * sendOfflineBlock
 * */
mcp.request.sendOfflineBlock({
    code: '0',
    msg: 'OK',
    hash: 'F310B56BABE79E8F6DFDE423EA261132F9901D0394070237307A10FFC2BBB06A',
    from: 'mcp4M3zGYDwWVkhsoP1FxMiuaKyRtc2wQFUDchbMQCkW2q2UmwroX',
    to: 'mcp4XeMPvNwNbJPruZJdrMQLEJpng22QaPDbNFcrKpdLxEewEPZQT',
    amount: '0',
    previous: 'BA87E5C6D13FFCF12D4EBB4BAB541B431CC789A45CAD43871F6FAE90B556E26D',
    gas: '0',
    data: '',
    exec_timestamp: '1548833884',
    work: '7BAB2E478AD92651',
    signature: 'D652E79C1E6A249217803E30BB4988D576A68D5747DC751EB2DC1ED4F54716CF239363B37A4ED92611FDE7256B425B3AF250E51B920AB547D5A6C3636C546D00'
})
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get transaction details
 * getBlock
 * */
mcp.request.getBlock('DD4673A78E6246F298B95DCC3F73990D8F0CCA252F24EA79BCA2D6FE5611D9E4')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get transaction details in bulk
 * getBlocks
 * */
mcp.request.getBlocks([
    'DD4673A78E6246F298B95DCC3F73990D8F0CCA252F24EA79BCA2D6FE5611D9E4'
])
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get multiple transactions under the stable specified mci
 * stableBlocks
 * TODO explorer
 * */
mcp.request.stableBlocks(0)
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Return details of unstable transactions
 * unstableBlocks
 * TODO explorer
 * */
mcp.request.unstableBlocks()
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get the maximum stable main chain index and maximum main chain index of the current node.
 * status
 * */
mcp.request.status()
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get the list of witnesses
 * witnessList
 * */
mcp.request.witnessList()
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get the pre-generated work of the specified account
 * getWork
 * */
mcp.request.getWork('mcp3VUEhUFFG7anjTPwgxDEwZAGnwxYYSrDTmxhiMrfQYmmx5MJX4')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get the state of the specified transaction
 */
mcp.request.getBlockState('1BE9E6B29AD56A2E36851176E5C67A180BA46875F03C5742427D2CD51D81306A')
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

/**
 * Get the state state of a specified transaction in batch
 */
mcp.request.getBlockStates(['1BE9E6B29AD56A2E36851176E5C67A180BA46875F03C5742427D2CD51D81306A',"484A3C6D08BEA39C5F69B58CC5765253BC449C6A15101A042819768CAD4AE8C0"])
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);

mcp.request.traceTransaction("E2858A380D6BEDF95385230C71D6A71F3C96AB90942FB97A4D0808BFB9F1A4E3")
    .then(ret => {
        if (ret.code === 0) {
            console.log('request success =>', ret);
        } else {
            console.log('request failed =>', ret);
        }
    })
    .catch(err => console.log);