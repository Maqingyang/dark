# Utils

## toBigNumber

Convert the value to `bignumber`

```
mcp.utils.toBigNumber(value)
```

### Parameters

| Field | Type | Description |
| ----- | --------------- | ------------ |
| value | String / Number | The value to be converted |

### Back to results

A value of type Bignumber

```
BigNumber {s: 1, e: 0, c: [2]}
```

### example

```
const bigVal = mcp.utils.toBigNumber(2);
```

## isBigNumber

Determine whether the value is a `bignumber` type value

```
mcp.utils.isBigNumber(value)
```

### Parameters

| Field | Type | Description |
| ----- | ------------------------------ | ------------ |
| value | String / Number /Bignumber ... | Value to be judged |

### Back to results

If it is a value of type Bignumber, return `true`, otherwise `false`

### example

```
const isBig = mcp.utils.isBigNumber(2);
```

## encode

Encode the value

```
mcp.utils.encode.parse(parm);
```

### Parameters

| Field | Type | Description |
| ---- | ------ | -------------- |
| parm | Object | Object to be encoded |

### Back to results

Encoded value

### example

```
let parm = {
    functionName: "constructor",
    args: ["1000000000000000000000000000", "mcp", "MCP"]
};
let data = mcp.utils.encode.parse(parm);

console.log("********************* data **********************" );
console.log(data);

// The results are as follows
//{ functionName:'constructor',
  args: ['1000000000000000000000000000','mcp','MCP' ],
  funABI:
   {inputs: [[Object], [Object], [Object] ],
     payable: false,
     stateMutability:'nonpayable',
     type:'constructor' },
  data:
   '60806040...'}
```

## decode

decoding

```
utils.decode.parse(bytecode, abi);
```

### Parameters

| Field | Type | Description |
| -------- | ------------ | ---------------- |
| bytecode | hexadecimal data | value to be decoded |
| abi | JSON | In what format to decode |

### Back to results

Decoded value

### example

```
let abi = {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
}

let name_response = "0x" + "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000A63616E6F6E436861696E00000000000000000000000000000000000000000000";

let nameInfo2 = mcp.utils.decode.parse(name_response, abi);
//[ { name: '', type: 'string', value: 'mcp' } ]
```

## encodeAccount

Convert the hexadecimal account to the account in `mcpxxx` format

```
mcp.utils.encodeAccount(value);
```

### Parameters

| Field | Type | Description |
| ----- | ------------ | ------------ |
| value | hexadecimal data | value to be converted |

### Back to results

Account in `mcpxxx` format

### example

```
let mcpAcc = mcp.utils.encodeAccount("B5F327E3F07F2C94DADCDB6D122ADDAFD3AA3AC9507E8F8368F9AD3E6A378798")
console.log(mcpAcc);//mcp4KsqkcZCs6i9VU2WUsiqTU8M6i3WYpVPFMcMXSkKmB92GJvYt1
```

## decodeAccount

Convert accounts in `mcpxxx` format to hexadecimal accounts

```
mcp.utils.decodeAccount(value);
```

### Parameters

| Field | Type | Description |
| ----- | -------------- | ------------ |
| value | Account in mcp format | Value to be converted |

### Back to results

Hexadecimal account

### example

```
try {
    let acc = mcp.utils.decodeAccount('mcp4KsqkcZCs6i9VU2WUsiqTU8M6i3WYpVPFMcMXSkKmB92GJvYt1');
    console.log(acc)
} catch (error) {
    console.log(error)
}
```

## fromCan

Convert from `can` unit to `mcp` unit

```
mcp.utils.fromCan(mcpVal)
```

### Parameters

| Field | Type | Description |
| ------ | ------ | ------------ |
| mcpVal | Number | Value to be converted |

### Back to results

`mcp` as the unit value

### example

```
let val = mcp.utils.fromCan(2);//0.000000000000000002
```

## fromCanToken

Convert the value to the Token balance by specifying the Token Accuracy

```
mcp.utils.fromCan(value,precision)
```

### Parameters

| Field | Type | Description |
| --------- | ------------- | -------------------------- |
| value | Number/String | The value to be converted |
| precision | Number/String | How many smallest units does a Token correspond to |

### Back to results

Specify the value in units of precision

### example

```
let val = mcp.utils.fromCanToken(2,1000000000000000000);//0.000000000000000002
```

## toCan

Convert `mcp` units to `can` units

```
mcp.utils.toCan(value)
```

### Parameters

| Field | Type | Description |
| ----- | ------ | ------------ |
| value | Number | The value to be converted |

### Back to results

`can` as the unit value

### example

```
let val = mcp.utils.toCan(2);//2000000000000000000
```
