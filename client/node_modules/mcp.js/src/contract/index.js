/* eslint-disable no-setter-return */
/**
 * To initialize a contract use:
 *
 *  var Contract = require('web3-eth-contract');
 *  Contract.setProvider('ws://localhost:8546');
 *  var contract = new Contract(abi, account, ...)
 */
"use strict";
// RPC communication
const url = require('url');
const HttpRequest = require('../httprequest');
// **************
const utils = require("../utils/");
const abi = require("../abi/");

// Set request
let request;
let mcpAccounts;

/**
 * Use the following method
 * utils._jsonInterfaceMethodToString   // Add to MCP util
 * utils._fireError                     // Add to MCP util
 * utils.isAccount(args.options.from)   // Add to MCP util
 * 
 * Use the following method
 * abi.encodeFunctionSignature(funcName);
 * abi.encodeEventSignature(funcName);
 * abi.encodeParameters(inputs, args)
 * abi.decodeLog(event.inputs, data.data, argTopics);
 * abi.decodeParameters(outputs, returnValues);
 */

/**
 * Need to create an instance when using
 * @method Contract
 * @constructor
 * @param {Array} jsonInterface
 * @param {String} account
 * @param {Object} options
 */
class Contract {
    /**
     * 
     * @param {*} jsonInterface 
     * @param {*} account 
     * @param {*} options 
     */
    constructor(jsonInterface, account, options) {
        var _this = this,
            args = Array.prototype.slice.call(arguments);
        // Determine if the prototype is in Contract
        // if (!(this instanceof Contract)) {
        //     throw new Error('Please use the "new" keyword to instantiate a contract object!');
        // }
        // Judge jsonInterface
        if (!jsonInterface || !(Array.isArray(jsonInterface))) {
            throw new Error('You must provide the json interface of the contract when instantiating a contract object.');
        }

        // create the options object
        this.options = {};
        this.methods = {};

        // Processing parameter assignment; options and contract account
        var lastArg = args[args.length - 1];
        if (utils.judge(lastArg) === 'object') {
            options = lastArg;
            this.options = Object.assign(this.options, this._getOrSetDefaultOptions(options));
            // Initialize ads
            if (utils.judge(account) === 'object') {
                account = null;
            }
        }

        this._account = null;
        this._jsonInterface = [];

        // get default account from the mci
        var defaultMci = this.constructor.defaultMci || 'latest';
        Object.defineProperty(this, 'defaultMci', {
            get: function () {
                return defaultMci;
            },
            set: function (val) {
                if (val) {
                    defaultMci = val;
                }
                return defaultMci;
            },
            enumerable: true
        });

        // Set up an account on this.options
        Object.defineProperty(this.options, 'account', {
            set: function (value) {
                if (value) {
                    _this._account = value;
                }
                return _this._account;
            },
            get: function () {
                return _this._account;
            },
            enumerable: true
        });

        // Set jsonInterface on this.options
        Object.defineProperty(this.options, 'jsonInterface', {
            set: function (value) {
                // All methods
                _this.methods = {};
                _this._jsonInterface = value.map(function (method) {
                    var func, // Function name
                        funcName; // Function name

                    // make constant and payable backwards compatible
                    // Determine whether it is variable and whether it can be paid
                    method.constant = (method.stateMutability === "view" || method.stateMutability === "pure" || method.constant);
                    method.payable = (method.stateMutability === "payable" || method.payable);

                    // Function name
                    if (method.name) {
                        // Typed functions testCall2(uint256,uint256)
                        funcName = utils._jsonInterfaceMethodToString(method);
                    }

                    // function
                    if (method.type === 'function') {
                        method.signature = abi.encodeFunctionSignature(funcName);//a()
                        // console.log("method.signature", method.signature);

                        func = _this._createTxObject && _this._createTxObject.bind({
                            method: method,
                            parent: _this
                        });// Used to assign to XXX

                        // Only when there is no adding method
                        if (!_this.methods[method.name]) {
                            _this.methods[method.name] = func;
                        } else {
                            // Have the same method.name, support the setting of different parameters for the same method.name
                            var cascadeFunc = _this._createTxObject.bind({
                                method: method,
                                parent: _this,
                                nextMethod: _this.methods[method.name]
                            });
                            _this.methods[method.name] = cascadeFunc;
                        }

                        _this.methods[method.signature] = func;
                        _this.methods[funcName] = func;
                    } else if (method.type === 'event') {
                        // event
                        method.signature = abi.encodeEventSignature(funcName);
                    }
                    return method;
                });
                return _this._jsonInterface;
            },
            get: function () {
                return _this._jsonInterface;
            },
            enumerable: true
        });

        // set getter/setter properties
        this.options.account = account;
        this.options.jsonInterface = jsonInterface;
    }

    /**
     * clone
     * @method clone
     * @return {Object} the event subscription
     */
    clone() {
        return new this.constructor(this.options.jsonInterface, this.options.account, this.options);
    }

    /**
     * deploy
     * @method deploy
     * @param {Object} options
     * @return {Object} EventEmitter possible events are "error", "transactionHash" and "receipt"
     */
    deploy(options) {
        options = options || {};
        options.arguments = options.arguments || [];
        options = this._getOrSetDefaultOptions(options);

        // If "data" is not specified, an error is returned
        if (!options.data) {
            return utils._fireError(new Error('No "data" specified in neither the given options, nor the default options.'), null, null, null);
        }
        // Find constructors, if not, then {}
        var constructors = this.options.jsonInterface.find(function (method) {
            return (method.type === 'constructor');
        }) || {};
        constructors.signature = 'constructor';

        // console.log(" -------- deploy -------- ")
        // console.log("constructors", constructors)
        // console.log('options.data ==> ', options.data)
        // console.log('this.constructor._mcpAccounts ==> ', this.constructor._mcpAccounts)
        // console.log('options.arguments ==> ', options.arguments)
        // console.log(" -------- deploy --------  \n");
        return this._createTxObject.apply({
            method: constructors,
            parent: this,
            deployData: options.data,
            _mcpAccounts: this.constructor._mcpAccounts
        }, options.arguments);
    }

    /**
     * Return an object with call sendBlock encodeABI functions
     * @method _createTxObject
     * @returns {Object} an object with functions to call the methods
     */
    _createTxObject() {
        // Convert to array
        var args = Array.prototype.slice.call(arguments);
        var txObject = {
            'tag': "mcp"
        };

        // Encode
        // Export bytecode
        txObject.encodeABI = this.parent._encodeMethodABI.bind(txObject);
        txObject.decodeABI = this.parent._decodeMethodABI.bind(txObject);
        txObject.sendToBlock = this.parent._getRpc.bind(txObject, 'sendToBlock', true);
        if (this.method.type === 'function') {
            txObject.call = this.parent._getRpc.bind(txObject, 'call');
            txObject.call.request = this.parent._getRpc.bind(txObject, 'call', true); // to make batch requests
        }
        txObject.sendBlock = this.parent._getRpc.bind(txObject, 'send'); // MCP sendBlock method
        txObject.sendBlock.request = this.parent._getRpc.bind(txObject, 'send', true); // to make batch requests

        if (args && this.method.inputs && args.length !== this.method.inputs.length) {
            if (this.nextMethod) {
                return this.nextMethod.apply(null, args);
            }
            throw `
                args_length: ${args.length},
                method_inputs_length: ${this.method.inputs.length},
                method_name: ${this.method.name}
            `;
        }

        txObject.arguments = args || [];
        txObject._method = this.method;
        txObject._parent = this.parent;
        txObject._mcpAccounts = this.parent.constructor._mcpAccounts || mcpAccounts;
        if (this.deployData) {
            txObject._deployData = this.deployData;
        }
        return txObject;
    }

    /**
     * Encode the ABI for the method, including the signature or method. Or when the constructor only encodes the constructor parameters.
     * Do bytycode based on ABI
     * @method _encodeMethodABI
     * @param {Mixed} args the arguments to encode
     * @param {String} the encoded ABI
     */
    _encodeMethodABI() {
        // this have call send _deployData
        var methodSignature = this._method.signature,
            // Passed parameters [ 0, 1 ]
            args = this.arguments || [];
        var signature = false;
        var paramsABI = this._parent.options.jsonInterface.filter(function (json) {
            return ((methodSignature === 'constructor' && json.type === methodSignature) ||
                ((json.signature === methodSignature || json.signature === methodSignature.replace('0x', '') || json.name === methodSignature) && json.type === 'function'));
        }).map(function (json) {
            var inputLength = (utils.judge(json.inputs) === 'array') ? json.inputs.length : 0;
            if (inputLength !== args.length) {
                throw new Error('The number of arguments is not matching the methods required number. You need to pass ' + inputLength + ' arguments.');
            }
            if (json.type === 'function') {
                signature = json.signature;
            }
            return (utils.judge(json.inputs) === 'array') ? json.inputs : [];
        }).map(function (inputs) {
            return abi.encodeParameters(inputs, args).replace('0x', '');
        })[0] || ''; // Methods and parameters are converted to hexadecimal
        // return constructor
        if (methodSignature === 'constructor') {
            // When deploying
            if (!this._deployData) {
                throw new Error('The contract has no contract data option set. This is necessary to append the constructor parameters.');
            }
            return this._deployData + paramsABI;
        } else {
            var returnValue = (signature) ? signature + paramsABI : paramsABI;
            if (!returnValue) {
                throw new Error('Couldn\'t find a matching contract method named "' + this._method.name + '".');
            } else {
                return returnValue;
            }
        }
    }

    /**
     * _decodeMethodABI
     * @param {string} encodeData encodeData
     * @returns {any} method params
     */
    _decodeMethodABI(encodeData) {
        if (!encodeData) {
            throw new Error('EncodeData cannot be empty.');
        }
        if (Object.prototype.toString.call(encodeData) !== '[object String]') {
            throw new Error('EncodeData must be of type string.');
        }
        // this have call send _deployData
        encodeData = encodeData.toLowerCase();
        encodeData = encodeData.replace('0x', '');

        const methodSignature = this._method.signature,
            // Passed parameters [ 0, 1 ]
            args = this.arguments || [];
        let signature = false;
        const inputsFn = this._parent.options.jsonInterface.filter(function (json) {
            return ((methodSignature === 'constructor' && json.type === methodSignature) ||
                ((json.signature === methodSignature || json.signature === methodSignature.replace('0x', '') || json.name === methodSignature) && json.type === 'function'));
        }).map(function (json) {
            const inputLength = (utils.judge(json.inputs) === 'array') ? json.inputs.length : 0;
            if (inputLength !== args.length) {
                throw new Error('The number of arguments is not matching the methods required number. You need to pass ' + inputLength + ' arguments.');
            }
            if (json.type === 'function') {
                signature = json.signature;
            }
            return (utils.judge(json.inputs) === 'array') ? json : {};
        });
        if (inputsFn.length !== 1) {
            throw new Error('Couldn\'t find a matching contract method named "' + this._method.name + '".');
        }

        const inputs = inputsFn[0];
        if (Object.keys(inputs) === 0) {
            throw new Error('Couldn\'t find a matching contract method named "' + this._method.name + '".');
        }

        if (methodSignature === 'constructor') {
            // When deploying
            if (!this._deployData) {
                throw new Error('The contract has no contract data option set. This is necessary to append the constructor parameters.');
            }
            encodeData = encodeData.replace(this._deployData.replace('0x', ''), '');
        } else {
            if (signature) {
                signature = signature.replace('0x', '');
                encodeData = encodeData.replace(signature, '');
            }
        }
        const retData = utils.decode.parseInputs('0x' + encodeData, inputs);
        return retData;
    }

    /**
     * _decodeMethodABI
     * @param {string} encodeData encodeData
     * @returns {any} method params
     */
    decodeABI(encodeData) {
        if (!encodeData) {
            throw new Error('EncodeData cannot be empty.');
        }
        if (Object.prototype.toString.call(encodeData) !== '[object String]') {
            throw new Error('EncodeData must be of type string.');
        }
        // this have call send _deployData
        encodeData = encodeData.toLowerCase();
        encodeData = encodeData.replace('0x', '');
        let methodSignature = '';
        let signature = false;
        const inputsFn = this.options.jsonInterface.filter(function (json) {
            const match = json.signature && encodeData.match(json.signature.replace('0x', ''));
            if (match && json.type === 'function') {
                methodSignature = match[0];
            }
            return match && json.type === 'function';
        }).map(function (json) {
            if (json.type === 'function') {
                signature = json.signature;
            }
            return (utils.judge(json.inputs) === 'array') ? json : {};
        });
        if (inputsFn.length !== 1) {
            throw new Error('Couldn\'t find a matching contract method named.');
        }
        const inputs = inputsFn[0];
        if (Object.keys(inputs) === 0) {
            throw new Error('Couldn\'t find a matching contract method named.');
        }
        if (signature) {
            signature = signature.replace('0x', '');
            encodeData = encodeData.replace(signature, '');
        }
        const retData = utils.decode.parseInputs('0x' + encodeData, inputs);
        return { parseData: retData, fnInfo: inputs };
    }

    /**
     * Formatted data assembly (requires parameters on the chain)
     * @method getOrSetDefaultOptions
     * @param {Object} options the options gived by the user
     * @return {Object} the options with gaps filled by defaults
     */
    _getOrSetDefaultOptions(options) {
        // console.log("getOrSetDefaultOptions ===> ", this.options);
        options.from = (options.from ? options.from : null) || this.options.from;
        options.gas_price = (options.gas_price ? String(options.gas_price) : null) || this.options.gas_price;
        options.data = options.data || this.options.data;
        options.gas = options.gas || this.options.gas;
        return options;
    }

    /**
     * 
     * @param {*} provider 
     * @param {*} accounts 
     */
    static setProvider(provider, accounts) {
        const parseUrlObj = url.parse(provider);
        const opt = {
            host: parseUrlObj.hostname,
            port: parseUrlObj.port
        };
        request = new HttpRequest(opt);
        mcpAccounts = accounts;
    }

    //-------------------------------------------------------------------------------------------

    /**
     * Perform calls and transactions on the contract
     * @method _getRpc
     * @param {String} type the type this execute function should execute
     * @param {Boolean} makeRequest if true, it simply returns the request parameters, rather than executing it
     */
    async _getRpc() {
        const _this = this;
        // Initialize the parameters that need to call RPC
        var args = this._parent._setRpcOpt.call(this, Array.prototype.slice.call(arguments));

        // console.log("___getRpc：Do you need to request a node", arguments)
        // console.log("___Required RPC interaction", args)
        // console.log("___outputs", this._method.outputs);

        const argsOpts = args.options;
        switch (args.type) {
            case 'call':
                const callOpts = {
                    from: argsOpts.from || '',
                    to: argsOpts.to,
                    data: argsOpts.data || '',
                    mci: argsOpts.mci || ''
                };
                const result = await request.call(callOpts);
                return new Promise(function (resolve, reject) {
                    if (result.code === 0) {
                        const beautifyData = _this._parent._decodeMethodReturn(_this._method.outputs, result.output);
                        _this._parent._runCallback(args.callback, null, beautifyData);
                        resolve(beautifyData);
                    } else {
                        _this._parent._runCallback(args.callback, new Error('Call Error'));
                        reject(result);
                    }
                });
            case 'sendToBlock':
                const opt = {
                    "from": argsOpts.from,
                    "to": argsOpts.to || "",
                    "amount": argsOpts.amount,
                    "password": argsOpts.password,
                    "gas": argsOpts.gas,
                    "gas_price": argsOpts.gas_price,
                    "data": argsOpts.data || '',
                    "gen_next_work": argsOpts.gen_next_work || '',
                    "id": argsOpts.id || '',
                    "previous": argsOpts.previous || ''
                };
                const res = await request.sendToBlock(opt);
                return res;
            case 'send':
                const sendOpts = {
                    "from": argsOpts.from,
                    "to": argsOpts.to || "",
                    "amount": argsOpts.amount,
                    "password": argsOpts.password,
                    "gas": argsOpts.gas,
                    "gas_price": argsOpts.gas_price,
                    "data": argsOpts.data || '',
                    "gen_next_work": argsOpts.gen_next_work || '',
                    "id": argsOpts.id || '',
                    "previous": argsOpts.previous || ''
                };
                const sendResult = await request.sendBlock(sendOpts);
                return new Promise(function (resolve, reject) {
                    // return
                    if (sendResult.code !== 0) {
                        _this._parent._runCallback(args.callback, new Error("Send Error"));
                        return reject(sendResult);
                    }
                    _this._parent._runCallback(args.callback, null, sendResult.hash);

                    // Get again
                    let searchRes;
                    let searchTimer;
                    // eslint-disable-next-line prefer-const
                    let startSearchTimer;
                    const startSearchHash = async function () {
                        // The above has been judged, there must be a hash
                        searchRes = await request.getBlockState(sendResult.hash);
                        if (searchRes.code !== 0) {
                            return reject(searchRes);
                        }
                        // Judge whether it is stable
                        if (searchRes.block_state.is_stable === 0) {
                            // Unstable, get it again
                            await startSearchTimer();
                        }

                        // Stable start to get block
                        const blockResInfo = await request.getBlock(sendResult.hash);
                        if (blockResInfo.code !== 0) {
                            return reject(blockResInfo);
                        }
                        if (searchRes.block_state.is_stable === 1) {
                            const searchResBloState = searchRes.block_state;
                            blockResInfo.block.is_stable = searchResBloState.is_stable;
                            blockResInfo.block.stable_content = searchResBloState.stable_content;
                            blockResInfo.block.content.level = searchResBloState.content.level;
                            resolve(blockResInfo);
                        }
                    };
                    startSearchTimer = async function () {
                        searchTimer = await setTimeout(startSearchHash, 1000);
                    };
                    startSearchTimer();
                });
        }
    }

    /**
     * Generate options to execute the call   1
     * @method setRpcOpt
     * @param {Array} args
     * @param {Promise} defer
     */
    _setRpcOpt(args, defer) {
        var processedArgs = {};
        // console.log(`-----args1,${args}`)
        processedArgs.type = args.shift();
        // console.log(`-----args2,${args}, ${processedArgs.type}`)
        // get the callback
        processedArgs.callback = this._parent._getCallback(args);

        // get block number to use for call
        if (
            processedArgs.type === 'call' &&
            args[args.length - 1] !== true &&
            (
                (utils.judge(args[args.length - 1]) === 'string') ||
                isFinite(args[args.length - 1])
            )
        ) {
            processedArgs.defaultMci = args.pop();
        }

        // get the options
        processedArgs.options = (utils.judge(args[args.length - 1]) === 'object') ? args.pop() : {};
        processedArgs.options = this._parent._getOrSetDefaultOptions(processedArgs.options);
        processedArgs.options.data = this.encodeABI();

        // add contract account
        if (!this._deployData && !utils.isAccount(this._parent.options.account)) {
            throw new Error('This contract object doesn\'t have account set yet, please set an account first.');
        }

        // If there is no deployed contract, the incoming ads will be used as a contract that needs to be called
        if (!this._deployData) {
            processedArgs.options.to = this._parent.options.account;
        }

        // If "data" is not specified, an error is returned
        if (!processedArgs.options.data) {
            return utils._fireError(new Error('Couldn\'t find a matching contract method, or the number of parameters is wrong.'), defer.eventEmitter, defer.reject, processedArgs.callback);
        }
        return processedArgs;
    }

    /**
     * Get the callback and modify the array if necessary
     * @method _getCallback
     * @param {[]} args
     * @return {Function} the callback
     */
    _getCallback(args) {
        if (args && (utils.judge(args[args.length - 1]) === 'function')) {
            return args.pop(); // modify the args array!
        }
    }

    /**
     * @param {*} callFn 
     * @param {*} error 
     * @param {*} data 
     */
    _runCallback(callFn, error, data) {
        if (utils.judge(callFn) === 'function') {
            callFn(error, data);
        }
    }

    /**
     * Decode the returned result
     * @param {*} outputs 
     * @param {*} returnValues 
     * @returns 
     */
    _decodeMethodReturn(outputs, returnValues) {
        //[ { name: '', type: 'uint256' }, { name: '', type: 'uint256' } ] 
        //'0x000000000000000000000000000000000000000000000000000000000000006e0000000000000000000000000000000000000000000000000000000000000077'
        // console.log(outputs);
        // console.log(returnValues);

        if (!returnValues) {
            return null;
        }
        // returnValues = returnValues.length >= 2 ? returnValues.slice(2) : returnValues;
        returnValues = returnValues.indexOf("0x") === -1 ? "0x" + returnValues : returnValues;
        // You can use decode to parse
        var result = abi.decodeParameters(outputs, returnValues);
        if (result.__length__ === 1) {
            return result[0];
        } else {
            delete result.__length__;
            return result;
        }
    }

    /**
     * _decodeEventABI
     * @method _decodeEventABI
     * @param {object} data
     * @param {string} data.id
     * @param {string} data.account
     * @param {string} data.data
     * @param {Array} data.topics
     * @param {string} data.block_hash
     * @return {Object} result object with decoded indexed && not indexed params
     */
    _decodeEventABI(data, event = this.subOptionsEvent) {
        data.id = data.id || '';
        data.account = data.account || '';
        data.data = data.data || '';
        data.topics = data.topics || [];
        data.block_hash = data.block_hash || '';
        var result = {};
        // if allEvents get the right event
        if (event.name === 'ALLEVENTS') {
            event = event.jsonInterface.find(function (intf) {
                return (intf.signature === '0x' + data.topics[0]);
            }) || { anonymous: true };
        }
        // create empty inputs if none are present (e.g. anonymous events on allEvents)
        event.inputs = event.inputs || [];
        // Handle case where an event signature shadows the current ABI with non-identical
        // arg indexing. If # of topics doesn't match, event is anon.
        if (!event.anonymous) {
            let indexedInputs = 0;
            event.inputs.forEach(input => input.indexed ? indexedInputs++ : null);
            if (indexedInputs > 0 && (data.topics.length !== indexedInputs + 1)) {
                event = {
                    anonymous: true,
                    inputs: []
                };
            }
        }

        result.id = data.id;
        result.account = data.account;
        result.block_hash = data.block_hash;

        var argTopics = event.anonymous ? data.topics : data.topics.slice(1);
        result.returnValues = abi.decodeLog(event.inputs, data.data, argTopics);
        delete result.returnValues.__length__;
        // add name
        result.event = event.name;
        // add signature
        result.signature = (event.anonymous || !data.topics[0]) ? null : data.topics[0];
        // move the data and topics to "raw"

        result.raw = {
            data: data.data,
            topics: data.topics
        };
        return result;
    }

    /**
     * 
     * @param {*} result 
     * @returns 
     */
    formatOutput(result) {
        var _this = this;
        if (Array.isArray(result)) {
            return result.map(function (res) {
                return _this._decodeEventABI(res);
            });
        } else {
            return _this._decodeEventABI(result);
        }
    }

    /**
     * Get past events from contracts
     * @method getPastEvents
     * @param {String} event
     * @param {Object} options
     * @param {Function} callback
     * @return {Object} the promievent
     */
    async getPastEvents(eventName, options) {
        // console.log(eventName, options);
        var subOptions = this._generateEventOptions.apply(this, arguments);
        // console.log("subOptions", subOptions)
        const curTopic = [];
        subOptions.params.topics.forEach(item => {
            curTopic.push(item.indexOf("0x") === 0 ? item.slice(2) : item);
        });

        const opt = {
            "from_stable_block_index": options.from_stable_block_index || 0,
            "to_stable_block_index": options.to_stable_block_index,
            "account": subOptions.params.account || '',
            "topics": curTopic || ''
        };
        // console.log("opt", opt);
        const events = await request.logs(opt);
        this.subOptionsEvent = subOptions.event;
        return this.formatOutput(events.logs);
    }

    /**
     * Gets the event signature and outputformatters
     * @method generateEventOptions
     * @param {Object} event
     * @param {Object} options
     * @param {Function} callback
     * @return {Object} the event options object
     */
    _generateEventOptions() {
        var args = Array.prototype.slice.call(arguments);

        // get the callback
        var callback = this._getCallback(args);

        // get the options
        var options = (utils.judge(args[args.length - 1]) === 'object') ? args.pop() : {};

        var event = (utils.judge(args[0]) === 'string') ? args[0] : 'allevents';

        event = (event.toLowerCase() === 'allevents') ? {
            name: 'ALLEVENTS',
            jsonInterface: this.options.jsonInterface
        } : this.options.jsonInterface.find(function (json) {
            return (json.type === 'event' && (json.name === event || json.signature === '0x' + event.replace('0x', '')));
        });

        if (!event) {
            throw new Error('Event "' + event.name + '" doesn\'t exist in this contract.');
        }

        if (!utils.isAccount(this.options.account)) {
            throw new Error('This contract object doesn\'t have account set yet, please set an account first.');
        }

        return {
            params: this._encodeEventABI(event, options),
            event: event,
            callback: callback
        };
    }

    /**
     * Should be used to encode indexed params and options to one final object
     * @method _encodeEventABI
     * @param {Object} event
     * @param {Object} options
     * @return {Object} everything combined together and encoded
     */
    _encodeEventABI(event, options) {
        options = options || {};
        var filter = options.filter || {},
            result = {};

        // use given topics
        if (utils.judge(options.topics) === 'array') {
            result.topics = options.topics;
            // create topics based on filter
        } else {
            result.topics = [];
            // add event signature
            if (event && !event.anonymous && event.name !== 'ALLEVENTS') {
                result.topics.push(event.signature);
            }
            // add event topics (indexed arguments)
            // console.log("event.name", event.name)
            // console.log("event.inputs", event.inputs)
            if (event.name !== 'ALLEVENTS') {
                var indexedTopics = event.inputs.filter(function (i) {
                    return i.indexed === true;
                }).map(function (i) {
                    var value = filter[i.name];
                    if (!value) {
                        return null;
                    }
                    // TODO: https://github.com/ethereum/web3.js/issues/344
                    // TODO: deal properly with components
                    if (utils.judge(value) === 'array') {
                        return value.map(function (v) {
                            return abi.encodeParameter(i.type, v);
                        });
                    }
                    return abi.encodeParameter(i.type, value);
                });
                result.topics = result.topics.concat(indexedTopics);
            }
            // if (!result.topics.length) {
            //     delete result.topics;
            // }
        }
        if (this.options.account) {
            result.account = this.options.account;
        }
        return result;
    }
    //******************************************************************************************* */
}

module.exports = Contract;
