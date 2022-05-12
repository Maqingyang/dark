"use strict";
// let rpc     = require('node-json-rpc');
// const options = {
//     host: "127.0.0.1",
//     port: 8765
// };
const rpc = require("./rpc-main");

class HttpRequest {

  /**
   * 
   * @param {*} host 
   * @param {*} timeout 
   * @param {*} apiVersion 
   */
  constructor(host, timeout, apiVersion){
    const hostCon = Object.assign({}, host);
    this.client = new rpc.Client(hostCon);
    // this.timeout = timeout || 0;
    // this.apiVersion = apiVersion || "v1";
  }

  /**
   * 
   * @param {*} opt 
   * @returns {Promise}
   */
  asyncFunc(opt) {
    return new Promise((resolve, reject) => {
      this.client.call(opt, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  
  // HttpRequest.prototype. client = client;
  // Account Start
  /**
   * Generate account 
   * enable_control Need to be set to true.
   * @param {string} pwd - Generate account password
   * @param {number} [gen_next_work] - (Optional) Whether to pre-generate the work value for the first transaction of the generated account, 0: no pre-generated, 1: pre-generated. The default is 1.
   * @returns {Promise<{code, msg}>}
   * */
  async accountCreate(pwd, gen_next_work) {
    if (!pwd) {
      return { code: 100, msg: "no param - pwd" };
    }
    if (gen_next_work !== 0) {
      gen_next_work = 1;
    }
    const opt = {
      action: "account_create",
      password: pwd,
      gen_next_work: gen_next_work,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Delete the account.
   * enable_control Need to be set to true.
   * @param {string} account - Deleted account
   * @param {string} pwd - password
   * @returns {Promise<{code, msg}>}
   * */
  async accountRemove(account, pwd) {
    if (!account) {
      return { code: 100, msg: "no param - account" };
    }
    if (!pwd) {
      return { code: 100, msg: "no param - pwd" };
    }
    const opt = {
      action: "account_remove",
      account: account,
      password: pwd,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Unlock account 
   * enable_control Need to be set to true.
   * @param {string} account - Unlocked account
   * @param {string} pwd - password
   * @returns {Promise<{code,msg}>} - `{"code": 0,"msg": "OK"}` for success
   * */
  async accountUnlock(account, pwd) {
    if (!account) {
      return { code: 100, msg: "no param - account" };
    }
    if (!pwd) {
      return { code: 100, msg: "no param - pwd" };
    }
    const opt = {
      action: "account_unlock",
      account: account,
      password: pwd,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Lock the account.
   * enable_control Need to be set to true.
   * @param {string} account - Locked account
   * @returns {Promise<{code, msg}>} - `{"code": 0,"msg": "OK"}` for success
   * */
  async accountLock(account) {
    if (!account) {
      return { code: 100, msg: "no param - account" };
    }
    const opt = {
      action: "account_lock",
      account: account,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Import account.
   * enable_control Need to be set to true.
   * @param {string} jsonFile - Import the json of the account
   * @param {number} [gen_next_work] - (Optional) Whether to pre-generate the work value for the first transaction imported into the account, 0: no pre-generated, 1: pre-generated. The default is 1.
   * @returns {Promise<{code, msg}>}
   * */
  async accountImport(jsonFile, gen_next_work) {
    if (!jsonFile) {
      return { code: 100, msg: "no param - jsonFile" };
    }
    if (gen_next_work !== 0) {
      gen_next_work = 1;
    }
    const opt = {
      action: "account_import",
      json: jsonFile,
      gen_next_work: gen_next_work,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Export account
   * @param {string} account - Exported account
   * @returns {Promise<{code, msg, json}>} - json: Export the json of the account
   * */
  async accountExport(account) {
    if (!account) {
      return 100;
    }
    const opt = {
      action: "account_export",
      account: account,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Verify that the account format is legal
   * @param {string} accountVal - Pending account
   * @returns {Promise<{code, msg, valid}>} - valid：Validation results，0：Invalid format，1：Legal format
   * */
  async accountValidate(accountVal) {
    if (!accountVal) {
      return 0;
    }
    const opt = {
      action: "account_validate",
      account: accountVal,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Change Password.
   * enable_control Need to be set to true.
   * @param {string} account - Change password account
   * @param {string} oldPwd - Original account password
   * @param {string} newPwd - New account password
   * @returns {Promise<{code, msg}>}
   * */
  async accountChangePwd(
    account,
    oldPwd,
    newPwd
  ) {
    if (!account || !oldPwd || !newPwd) {
      return { code: 100, msg: "no param" };
    }
    return await this.asyncFunc({
      action: "account_password_change",
      account: account,
      old_password: oldPwd,
      new_password: newPwd,
    });
  }
  
  /**
   * Get all accounts of the current node.
   * enable_control Need to be set to true.
   * @returns {Promise<{code, msg, accounts}>} - accounts: {string[]} Account list
   * */
  async accountList() {
    const opt = {
      action: "account_list",
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get transaction details of a specified account.
   * enable_control Need to be set to true.
   * @param {string} account - Specify query account
   * @param {number} [limit] - Returns the upper limit of the transaction, if it exceeds the default 1000, the default is 1000
   * @param {string} [index] - (Optional) The current query index, which comes from next_index in the returned result, and is empty by default
   * @returns {Promise<{code, msg, blocks, next_index}>} - blocks: {Array.<Block>} Transaction details list, next_index: Query index
   * */
  async accountBlockList(account, limit, index) {
    if (!account) {
      return { code: 100, msg: "no param - account" };
    }
    const req = {
      action: "account_block_list",
      account: account,
    };
    if (!limit || +limit > 1000) {
      req.limit = 1000;
    } else {
      req.limit = limit;
    }
    if (index) {
      req.index = index;
    }
    return await this.asyncFunc(req);
  }
  
  // Account End
  /**
   * Get the specified account balance
   * @param {string} account - Designated account
   * @returns {Promise<{code, msg, balance}>} - balance：{string} Account Balance
   * */
  async accountBalance(account) {
    if (!account) {
      return { code: 100, msg: "no param - account" };
    }
    const opt = {
      action: "account_balance",
      account: account,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get the balance of multiple accounts
   * @param {string[]} accountAry - Multiple accounts specified
   * @returns {Promise<{code, msg, balances}>} - balances {Object.<string, string>}
   * */
  async accountsBalances(accountAry) {
    if (!accountAry || accountAry.length === 0) {
      return { code: 100, msg: "no param - accountAry" };
    }
    const opt = {
      action: "accounts_balances",
      accounts: accountAry,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Return the compiled smart contract code for the given address (if any)
   * @param account
   * @returns {Promise<{code: number, msg: string}>}
   */
  async accountCode(account) {
    if (!account) {
      return { code: 100, msg: "no param - account" };
    }
    const opt = {
      action: "account_code",
      account: account,
    };
    return await this.asyncFunc(opt);
  }
  
  async sendToBlock(transaction) {
    console.log(transaction);
    const opt = {
      action: "send_block",
      from: transaction.from,
      to: "",
      amount: transaction.amount.toString(),
      password: transaction.password,
      gas: transaction.gas,
      gas_price: transaction.gas_price,
      data: transaction.data || "",
      gen_next_work: transaction.gen_next_work,
    };
    if (transaction.to) {
      opt.to = transaction.to;
    }
    if (transaction.id) {
      opt.id = transaction.id;
    }
    if (transaction.previous) {
      opt.previous = transaction.previous;
    }
    // console.log("opt", opt);
    const res = await window.aleereum.send(opt);
    // console.log(res);
    return res;
  }
  
  /**
   * Send the transaction. 
   * enable_control Need to be set to true.
   * @param {object} transaction - Trading partners
   * @returns {Promise<{code, msg, hash}>}
   * */
  async sendBlock(transaction) {
    if (!transaction || !transaction.from || !transaction.password) {
      return {
        code: 100,
        msg: `no param - transaction ${JSON.stringify(transaction)}`,
      };
    }
    if (!(+transaction.amount >= 0 && +transaction.gas >= 0)) {
      return {
        code: 110,
        msg: `transaction not valid - transaction ${JSON.stringify(transaction)}`,
      };
    }
    if (transaction.gen_next_work !== 0) {
      transaction.gen_next_work = 1;
    }
    const opt = {
      action: "send_block",
      from: transaction.from,
      to: "",
      amount: transaction.amount.toString(),
      password: transaction.password,
      gas: transaction.gas,
      gas_price: transaction.gas_price,
      data: transaction.data || "",
      gen_next_work: transaction.gen_next_work,
    };
    if (transaction.to) {
      opt.to = transaction.to;
    }
    if (transaction.id) {
      opt.id = transaction.id;
    }
    if (transaction.previous) {
      opt.previous = transaction.previous;
    }
    return await this.asyncFunc(opt);
  }
  
  /**
   * Generate an unsigned transaction and return transaction details.
   * enable_control Need to be set to true.
   * @param {object} transaction - Trading partners
   * @returns {Promise<{object}>}
   * */
  async generateOfflineBlock(transaction) {
    if (!transaction || !transaction.from) {
      return {
        code: 100,
        msg: `no param - transaction ${JSON.stringify(transaction)}`,
      };
    }
    if (!(+transaction.amount >= 0 && +transaction.gas >= 0)) {
      return {
        code: 110,
        msg: `transaction not valid - transaction ${JSON.stringify(transaction)}`,
      };
    }
    const opt = {
      action: "generate_offline_block",
      from: transaction.from,
      to: transaction.to || "",
      amount: transaction.amount, // 1CCN
      gas: transaction.gas,
      gas_price: transaction.gas_price,
      data: transaction.data || "",
    };
    if (transaction.previous) {
      opt.previous = transaction.previous;
    }
    return await this.asyncFunc(opt);
  }
  
  /**
   * Send a signed transaction, the request parameter comes from the interface generate_offline_block, and the transaction hash is returned.
   * enable_control Need to be set to true.
   * @param {object} block - object returns from generate_offline_block
   * @returns {Promise<{code, msg, hash}>} - hash: Transaction hash
   * */
  async sendOfflineBlock(block) {
    if (!block || !block.from) {
      return { code: 100, msg: `no param - block ${JSON.stringify(block)}` };
    }
    if (!(+block.amount >= 0 && +block.gas >= 0)) {
      return {
        code: 110,
        msg: `block not valid - block ${JSON.stringify(block)}`,
      };
    }
    if (block.gen_next_work !== 0) {
      block.gen_next_work = 1;
    }
    const opt = {
      action: "send_offline_block",
      hash: block.hash,
      from: block.from,
      to: block.to,
      amount: block.amount,
      gas: block.gas,
      gas_price: block.gas_price,
      data: block.data || "",
      previous: block.previous,
  
      exec_timestamp: block.exec_timestamp,
      work: block.work,
      signature: block.signature,
      id: block.id || "",
      gen_next_work: block.gen_next_work || "",
    };
    if (block.to) {
      opt.to = block.to;
    }
    if (block.id) {
      opt.id = block.id;
    }
    return await this.asyncFunc(opt);
  }
  
  /**
   * Signed message
   * @param {string} public_key - Signature public key
   * @param {string} password - Public key password
   * @param {string} msg - Signed message
   * @returns {Promise<{code, msg, hash}>} - hash: Transaction hash
   * */
  async signMsg(public_key, password, msg) {
    if (!public_key || !password || !msg) {
      return { code: 100, msg: "no param" };
    }
    return await this.asyncFunc({
      action: "sign_msg",
      public_key: public_key,
      password: password,
      msg: msg,
    });
  }
  
  /**
   * Send transaction： send()
   * @param {object} sendObj 
   * @param {*} sendObj.from
   * @param {*} sendObj.to
   * @param {*} sendObj.amount
   * @param {*} sendObj.password
   * @param {*} sendObj.data
   * @param {*} sendObj.id
   * @param {*} sendObj.gas
   * @param {*} sendObj.gas_price
   * @returns {{block:string}}
   */
  async send(sendObj) {
    // This is the old interface; it is obsolete in nodes after 0.9.6r, use send_block instead
    if (Object.keys(sendObj).length == 0) {
      return 0; // No parameters
    }
    const opt = {
      action: "send",
      from: sendObj.from,
      amount: sendObj.amount,
      gas: sendObj.gas,
      gas_price: sendObj.gas_price,
      password: sendObj.password,
      data: sendObj.data || "",
    };
    if (sendObj.to) {
      opt.to = sendObj.to;
    }
    if (sendObj.id) {
      opt.id = sendObj.id;
    }
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get transaction details
   * @param {string} blockHash - Transaction hash
   * @returns {Promise<{code, msg, block}>} - block {object}
   * */
  async getBlock(blockHash) {
    if (!blockHash) {
      return { code: 100, msg: "no param - blockHash" };
    }
    const opt = {
      action: "block",
      hash: blockHash,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get transaction details in bulk
   * @param {string[]} blockHashAry - Transaction hash list
   * @returns {Promise<{code, msg, blocks}>}  - blocks {object[]}
   * */
  async getBlocks(blockHashAry) {
    if (!blockHashAry || blockHashAry.length === 0) {
      return { code: 100, msg: "no param - blockHashAry" };
    }
    const opt = {
      action: "blocks",
      hashes: blockHashAry,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get transaction status details
   * @param blockHash
   * @returns {Promise<{code: number, msg: string}>}
   */
  async getBlockState(blockHash) {
    if (!blockHash) {
      return { code: 100, msg: "no param - blockHash" };
    }
    const opt = {
      action: "block_state",
      hash: blockHash,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get transaction status in batches
   * @param blockHashAry
   * @returns {Promise<{code: number, msg: string}>}
   */
  async getBlockStates(blockHashAry) {
    if (!blockHashAry || blockHashAry.length === 0) {
      return { code: 100, msg: "no param - blockHashAry" };
    }
    const opt = {
      action: "block_states",
      hashes: blockHashAry,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get account list： blockList()
   * @param {*} account 
   * @param {*} limit 
   * @param {*} index 
   * @returns {{next_index:number}} Stable transactions in the current account (not including forks)
   */
  async blockList(account, limit, index) {
    let opt;
    if (!account) {
      return 0; // No parameters
    }
    if (!limit) {
      return 1; // No parameters
    }
    if (!index) {
      opt = {
        action: "block_list",
        account: account,
        limit: limit,
      };
    } else {
      opt = {
        action: "block_list",
        account: account,
        limit: limit,
        index: index,
      };
    }
    //next_index
    /*
     * From - >
     * */
    return await this.asyncFunc(opt);
  }
  
  // The incoming mci value returns the information of all blocks under mci
  /*
  {
      "action"    :"mci_blocks",
      "mci"       :"121",
      "limit"     :"50",
      "next_index":'',    // Pass an empty string for the first time, and subsequent values will be taken from the previous result next_index
  }
  ->
  {
      blocks:[],
      "next_index": "XXX" // "" or a string of strings, if next_index == "" the block request under this mci ends
  };
  */
  /**
   * @deprecated
   * */
  async mciBlocks(mci, limit, next_index) {
    if (!limit) {
      return 1; // No parameters
    }
    let opt;
    if (next_index) {
      opt = {
        action: "mci_blocks",
        mci: mci,
        limit: limit,
        next_index: next_index,
      };
    } else {
      opt = {
        action: "mci_blocks",
        mci: mci,
        limit: limit,
      };
    }
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get multiple transactions under the stable specified mci.
   * @param {number} limit - Returns the upper limit of the transaction, if it exceeds 1000, the default is 1000
   * @param {string} [index] - (Optional) The current query index, which comes from next_index in the returned result, and is empty by default.
   * @returns {Promise<{code, msg, blocks, next_index}>}
   * */
  async stableBlocks(limit, index) {
    if (!limit || limit > 1000) {
      limit = 1000;
    }
    let opt;
    if (index === undefined) {
      opt = {
        action: "stable_blocks",
        limit: limit,
      };
    } else {
      opt = {
        action: "stable_blocks",
        limit: Number(limit),
        index: Number(index),
      };
    }
    return await this.asyncFunc(opt);
  }
  
  // Information of all currently unstable blocks
  /*
  {
      "action"    :"unstable_blocks",
      "mci"       :"121",
      "limit"     :"50",
      "next_index":'',    //  Pass an empty string for the first time, and the subsequent value will take the next_index from the previous result
  }
  ->
  {
      blocks:[],
      "next_index": "XXX" // "" or a string of strings, if next_index == "" the block request under this mci ends
  };
  */
  /**
   * Returns the details of unstabilized transactions.
   * @param {number} limit - Returns the upper limit of the transaction, if it exceeds 1000, the default is 1000.
   * @param {string} [index] - (Optional) The current query index, which comes from next_index in the returned result, and is empty by default.
   * @returns {Promise<{code, msg, blocks, next_index}>}
   * */
  async unstableBlocks(limit, index) {
    if (!limit || limit > 1000) {
      limit = 1000;
    }
    let opt;
    if (index === undefined) {
      opt = {
        action: "unstable_blocks",
        limit: limit,
      };
    } else {
      opt = {
        action: "unstable_blocks",
        limit: limit,
        index: index,
      };
    }
    return await this.asyncFunc(opt);
  }
  
  // Mci and block information of the last stable point
  /*
  return
      {
          last_stable_mci: 100,
          last_mci:122
      }
  */
  /**
   * Get the maximum stable main chain index and maximum main chain index of the current node.
   * @returns {Promise<{code, msg, last_stable_mci, last_mci}>}
   * */
  async status() {
    const opt = {
      action: "status",
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get the list of witnesses.
   * @returns {Promise<{code, msg, witness_list}>}
   * */
  async witnessList() {
    return await this.asyncFunc({
      action: "witness_list",
    });
  }
  
  /**
   * Get the pre-generated work of the specified account.
   * enable_control Need to be set to true.
   * @param {string} account - Designated account
   * @returns {Promise<{code, msg, root, work}>}
   * */
  async getWork(account) {
    if (!account) {
      return { code: 100, msg: "no param - account" };
    }
    return await this.asyncFunc({
      action: "work_get",
      account: account,
    });
  }
  
  /**
   * Get the current node daemon version number, rpc version number, and database version number.
   * @returns {Promise<{code, msg, version, rpc_version, store_version}>}
   * */
  async version() {
    return await this.asyncFunc({
      action: "version",
    });
  }
  
  /**
   * Stop program
   * @returns {Promise<{code, msg}>}
   * */
  async stop() {
    const opt = {
      action: "stop",
    };
    return await this.asyncFunc(opt);
  }
  
  // **************************************************************** Contract related start
  /**
   * Get contract status
   * @param {string} from - Source account
   * @param {string} to - Target account
   * @param {string} data - Contract code or data.
   * @returns {Promise<{code, msg, output}>}
   * Return success
   * {
      "code": 0,
      "msg": "OK",
      "output": "692A70D2E424A56D2C6C27AA97D1A86395877B3A2C6C27AA97D1A86395877B5C"
    }
    // Return failed
    {
      "code": 3,  //1,2,3,4,5
      "msg": "Invalid to account"
    }
   * */
  async call(call_obj) {
    const opt = {
      action: "call",
      to: call_obj.to,
    };
    if (call_obj.from) {
      opt.from = call_obj.from;
    }
    if (call_obj.data) {
      opt.data = call_obj.data;
    }
    if (call_obj.mci) {
      opt.mci = call_obj.mci;
    }
    return await this.asyncFunc(opt);
  }
  
  /**
   * Estimate the amount of gas consumed by the transaction
   * @param \{
          "from": "mcp4qwoBUYAvxgoVq5FHsXCCCkLCVuJ1z4224ZUVZRGhyawuzbWyh",// (Optional) Source account.
          "to": "mcp3gustGDwMtuUTn1iJHBwRYXCBNF51dRixXNeumWDwZLvH43J3d",// (Optional) Target account.
          "amount": "1000000000000000000", // (Optional) string, amount, unit: 10-18CCN.
          "password": "s4iH1t@hBFtymA",// (Optional) Source account password.
          "gas": 1000,                    // [Required] The upper limit of gas used to execute transactions.
          "gas_price": "1000000000000",   // [Required] Gas price, unit: 10-18CCN/gas, handling fee = actual gas used * gas_price.
          "data": "496E204D617468205765205472757374"// (Optional) Smart contract code or data. The default is empty.
      }
   * @param {object} req 
   * @param {*} req.from
   * @param {*} req.to
   * @param {*} req.amount
   * @param {*} req.data
   * @param {string} req.gas [Required]The upper limit of gas used to execute transactions.
   * @param {string} req.gas_price [Required]Gas price, unit: 10-18CCN/gas, handling fee = gas actually used * gas_price.
   * @param {*} req.mci
   * @returns {Promise<{code, msg}>}
   * */
  async estimateGas(req = {}) {
    const opt = { action: "estimate_gas" };
    req.from && (opt.from = req.from);
    req.to && (opt.to = req.to);
    req.amount && (opt.amount = req.amount);
    req.gas && (opt.gas = req.gas);
    req.gas_price && (opt.gas_price = req.gas_price);
    req.data && (opt.data = req.data);
    req.mci && (opt.mci = req.mci);
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get insider transactions
   * @param {*} hash 
   * @returns {Promise<{code, msg}>}
   */
  async blockTraces(hash) {
    if (!hash) {
      return { code: 100, msg: "no param - hash" };
    }
    const opt = {
      action: "block_traces",
      hash: hash,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * Get debug_trace_transaction information
   * @param {*} hash 
   * @returns {Promise<{code, msg}>}
   */
  async traceTransaction(hash) {
    if (!hash) {
      return { code: 100, msg: "no param - hash" };
    }
    const opt = {
      action: "debug_trace_transaction",
      hash: hash,
    };
    return await this.asyncFunc(opt);
  }
  
  /**
   * 
   * @param {object} opts 
   * @param {*} opts.from_stable_block_index
   * @param {*} opts.account
   * @param {*} opts.topics
   * @param {*} opts.to_stable_block_index
   * @returns {Promise<{code, msg}>}
   */
  async logs(opts) {
    const opt = {
      action: "logs",
      from_stable_block_index: opts.from_stable_block_index || 0,
      account: opts.account || "",
      topics: opts.topics || "",
    };
    if (opts.to_stable_block_index) {
      opt.to_stable_block_index = opts.to_stable_block_index;
    }
    return await this.asyncFunc(opt);
  }
  
  /**
   * 
   * @param {object} opts 
   * @param {*} opts.hash
   * @param {*} opts.account
   * @param {*} opts.begin
   * @param {*} opts.max_results
   * @returns {Promise<{code, msg}>}
   */
  async debugStorageRangeAt(opts) {
    const opt = {
      action: "debug_storage_range_at",
      hash: opts.hash,
      account: opts.account,
      begin: opts.begin,
    };
    if (opts.max_results) {
      opt.max_results = opts.max_results;
    }
    return await this.asyncFunc(opt);
  }
  
  // **************************************************************** Contract related end
}

module.exports = HttpRequest;