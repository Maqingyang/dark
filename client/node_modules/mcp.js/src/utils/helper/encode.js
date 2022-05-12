const AbiCoder = require('./abi-coder/index');

// const compile = require('./compile/index')//compile.js
const compile = require('./compile/crc20');//compile.js
/**
 * 
 * @param {*} Params 
 * @param {*} abiObj 
 * @returns 
 */
function parse(Params, abiObj) {
    let funABI = '';
    if(!abiObj){
        const functionName = Params.functionName;
        const abi = abiObj || compile.abi;
        const args = Params.args ? Params.args : [];
        for (const i in abi) {
            let name;
            if (abi[i].name === undefined) {
                name = abi[i].type;
            } else {
                name = abi[i].name;
            }

            if (name === functionName) {
                funABI = abi[i];
                break;
            }
        }
        Params.funABI = funABI;
        const types = [];
        if (funABI.inputs && funABI.inputs.length) {
            for (let i = 0; i < funABI.inputs.length; i++) {
                const type = funABI.inputs[i].type;
                types.push(type);
                if (args.length < types.length) {
                    args.push('');
                }
            }
        }
        const abiCoder = new AbiCoder();
        let paramsEncode = abiCoder.encode(types, args);
        paramsEncode = paramsEncode.substr(0, 2) === "0x" ? paramsEncode.substr(2) : paramsEncode;
        if (funABI.name === "constructor" || funABI.type === "constructor") {
            Params.data = compile.contractByteCode + paramsEncode;
        } else {
            const methodBytecode = compile.methodBytecode;
            Params.data = methodBytecode[functionName] + paramsEncode;
        }
        return Params;
    } else {
        funABI=abiObj;
        const args=Params.funArgs;
        const types = [];
        if (funABI.inputs && funABI.inputs.length) {
            for (let i = 0; i < funABI.inputs.length; i++) {
                const type = funABI.inputs[i].type;
                types.push(type.indexOf('tuple') === 0 ? makeFullTupleTypeDefinition(funABI.inputs[i]) : type);
                if (args.length < types.length) {
                    args.push('');
                }
            }
        }
        // NOTE: the caller will concatenate the bytecode and this
        //       it could be done here too for consistency
        return new AbiCoder().encode(types, args);
    }

    /**
     * 
     * @param {*} typeDef 
     * @returns 
     */
    function makeFullTupleTypeDefinition (typeDef) {
        if (typeDef && typeDef.type.indexOf('tuple') === 0 && typeDef.components) {
            const innerTypes = typeDef.components.map((innerType) => innerType.type);
            return `tuple(${innerTypes.join(',')})${this.extractSize(typeDef.type)}`;
        }
        return typeDef.type;
    }
}
module.exports = {
    parse: parse
};

