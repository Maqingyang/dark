const AbiCoder = require('./abi-coder/index');
// console.log("Start")

// **************** tuple
/**
 * Extraction size
 * @param {string} type 
 * @returns {string}
 */
function extractSize(type) {
    const size = type.match(/([a-zA-Z0-9])(\[.*\])/);
    return size ? size[2] : '';
}

/**
 * Perform complete tuple type definition
 * @param {*} typeDef 
 * @returns 
 */
function makeFullTupleTypeDefinition(typeDef) {
    if (typeDef && typeDef.type.indexOf('tuple') === 0 && typeDef.components) {
        const innerTypes = typeDef.components.map((innerType) => innerType.type);
        return `tuple(${innerTypes.join(',')})${extractSize(typeDef.type)}`;
    }
    return typeDef.type;
}
// **************** tuple
/**
 * 
 * @param {*} hex_data 
 * @param {object} fnabi
 * @param {boolean} fnabi.constant
 * @param {{ name: string, type: string }[]} fnabi.inputs
 * @param {string} fnabi.name
 * @param {{ name: string, type: string }[]} fnabi.outputs
 * @param {boolean} fnabi.payable
 * @param {string} fnabi.stateMutability
 * @param {string} fnabi.type
 * @returns {{ name: string, type: string, value: string }[]}
 */
function parseToArray(hex_data, fnabi) {
    // console.log(hex_data)
    // console.log(fnabi)
    // If there are outputs
    if (fnabi.outputs && fnabi.outputs.length > 0) {
        try {
            let i;
            // ABI output type
            const outputTypes = [];
            for (i = 0; i < fnabi.outputs.length; i++) {
                // string
                const type = fnabi.outputs[i].type;
                outputTypes.push(type.indexOf('tuple') === 0 ? makeFullTupleTypeDefinition(fnabi.outputs[i]) : type);//helper
            }

            if (!hex_data.length) {
                // Make sure that the data is filled with at least 0, because if there is no data, "AbiCoder" will throw an error
                hex_data = new Uint8Array(32 * fnabi.outputs.length);
            }
            // decode data
            const abiCoder = new AbiCoder();
            const decodedObj = abiCoder.decode(outputTypes, hex_data);

            const output_ary = [];
            for (i = 0; i < outputTypes.length; i++) {
                // { name: '', type: 'string' }
                const name = fnabi.outputs[i].name;
                // console.log(outputTypes[i], decodedObj[i])
                if (outputTypes[i] === "address") {
                    const account = "0x" + decodedObj[i].substr(26).toUpperCase();

                    output_ary.push(
                        {
                            name: name || "",
                            type: outputTypes[i],
                            value: account
                        }
                    );
                } else if(outputTypes[i] === "address[]"){
                    const accounts=[];
                    for(let j=0;j<decodedObj[i].length;j++){
                        accounts.push("0x" + decodedObj[i].substr(26).toUpperCase());
                    }
                    output_ary.push(
                        {
                            name: name || "",
                            type: outputTypes[i],
                            value: accounts
                        }
                    );
                } else {
                    output_ary.push(
                        {
                            name: name || "",
                            type: outputTypes[i],
                            value: decodedObj[i]
                        }
                    );
                }
            }
            return output_ary;
        } catch (e) {
            return { error: 'Failed to decode output: ' + e };
        }
    }
    return [];
}

function parseInputsToArray(hex_data, fnabi) {
    if (fnabi.inputs && fnabi.inputs.length > 0) {
        try {
            let i;
            // ABI output type
            const inputsTypes = [];
            for (i = 0; i < fnabi.inputs.length; i++) {
                // string
                const type = fnabi.inputs[i].type;
                inputsTypes.push(type.indexOf('tuple') === 0 ? makeFullTupleTypeDefinition(fnabi.inputs[i]) : type);//helper
            }
            if (!hex_data.length) {
                // Make sure that the data is filled with at least 0, because if there is no data, "AbiCoder" will throw an error
                hex_data = new Uint8Array(32 * fnabi.inputs.length);
            }
            // decode data
            const abiCoder = new AbiCoder();
            const decodedObj = abiCoder.decode(inputsTypes, hex_data);
            return decodedObj;
        } catch (e) {
            // console.log("err");
            return { error: 'Failed to decode input: ' + e };
        }
    }
    return [];
}

// ABI started
const owner_abi = {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
};
const name_abi = {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
};
const symbol_abi = {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
};
const decimals_abi = {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
};
const balance_of_abi = {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
};
const total_supply_abi = {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
};
const allowance_abi = {
    constant: true,
    inputs: [{ name: "", type: "address" }, { name: "", type: "address" }],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
};

// fn
const pageUtility = {
    parse: (data, abi) => {
        data = (data.indexOf("0x") === -1) ? "0x" + data : data;
        return parseToArray(data, abi);
    },
    parseInputs: (data, abi) => parseInputsToArray(data, abi),
    // owner
    owner: (data) => {
        return pageUtility.parse(data, owner_abi);
    },
    // name
    name: (data) => {
        return pageUtility.parse(data, name_abi);
    },
    // symbol
    symbol: (data) => {
        return pageUtility.parse(data, symbol_abi);
    },
    // precision
    decimals: (data) => {
        return pageUtility.parse(data, decimals_abi);
    },
    // lump sum
    totalSupply: (data) => {
        return pageUtility.parse(data, total_supply_abi);
    },
    // Check the number of tokens corresponding to account A
    balanceOf: (data) => {
        return pageUtility.parse(data, balance_of_abi);
    },
    // View authorized transfers
    allowance: (data) => {
        return pageUtility.parse(data, allowance_abi);
    }
};

module.exports = {
    parse: pageUtility.parse,
    parseInputs: pageUtility.parseInputs,
    name: pageUtility.name,                 // name
    symbol: pageUtility.symbol,             // symbol
    owner: pageUtility.owner,               // owner
    decimals: pageUtility.decimals,         // precision
    totalSupply: pageUtility.totalSupply,   // Total supply
    balanceOf: pageUtility.balanceOf,
    allowance: pageUtility.allowance
};