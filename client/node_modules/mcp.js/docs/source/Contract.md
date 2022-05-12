# Contract

## Use

The `Contract` object makes it easier for developers to interact with the `MCP` node in smart contracts;

> Developers **must provide the corresponding smart contract json interface**

The format of the json interface is as follows:

```json
[
	{
		"constant": true,
		"inputs": [],
		"name": "xxx",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	...
]
```

### Agreement

- **Parameters**: `[]` Parameters in the whole brackets are optional parameters, others are required
- The `myContract` variables appearing in the document are all contract instances;

---



## New contract

Create a contract instance (including all methods defined in the json interface)

```js
let myContract = new mcp.Contract(jsonInterface[, account][, options])
```

### Parameter

- `jsonInterface` \<Object> ：json interface
- `account` \<String> : The address of the contract that needs to be called
  - Subsequent settings can also be set by `myContract.options.account ='mcp_account'`
- `options` \<Object>：As a fallback parameter of call and sendBlock
  - `from` \<String> : Default sending address
  - `gas_price` \<String> : Default Gas price Unit: 1\*10<sup>-18</sup> MCP
  - `gas` \<String> | \<Number> : Maximum Gas provided for the transaction
  - `data` \<String> : Contract bytecode

### return value

`Object`: contract instance and all methods

### Example

```js
let myContract = new mcp.Contract(
    [...],
    'mcp_contract_address',
    {
        from: 'mcp_account',
        gas_price: '20000000000',
        gas:'2000000',
        data:''
    }
);
```



---

## myContract attributes

- options

  - options.account
  - options.jsonInterface

- methods

## options

```js
myContract.options;
```

### Attributes

The attribute is the `Object` option

- account \<String> The address of the deployment contract;
- jsonInterface \<Array>: Json interface (contains the sign attribute value)
- data \<String>: Byte code, used during contract deployment
- from \<String>: Default sending address (`null` if none)
- gas_price \<String>: Gas price for transaction
- gas \<String> | \<Number>: Maximum Gas provided for the transaction (Gas limit)

### Example

```js
//get
myContract.options;
> {
    account: 'contract_account',
    jsonInterface: [...],
    from: 'mcp_account',
    gas_price: '10000000000000',
    gas: 1000000
}

//set
myContract.options.account = 'contract_account';
myContract.options.from = 'mcp_account';
myContract.options.gas_price = '2000000000';
myContract.options.gas = 5000000;
```



---

## options.account

The contract address that needs to be interacted. All transactions in the instance will use this address as the value of `'to'`;

### Attributes

`myContract.options.account` \<String> | \<Null>: The address of this contract, if the address has not been set, it will be `null`.

### Example

```js
//get
myContract.options.account;
> 'mcp_contract_address'

// set
myContract.options.account = 'mcp_contract_address';
```



---

## options.jsonInterface

Contract json interface

### Attributes

`myContract.options.jsonInterface` \<Array>: The json interface of this contract

**Reset the method that will regenerate the contract instance**;

### Example

```js
myContract.options.jsonInterface;
> [
    {
        "type":"function",
        "name":"foo",
        "inputs": [{"name":"a","type":"uint256"}],
        "outputs": [{"name":"b","type":"address"}]
    }
]

// set
myContract.options.jsonInterface = [...];
```


---

## myContract.methods attributes

`myContract.methods` returns all callable methods of the contract;

Each method will create a transaction object, you can `call` `sendBlock` `encodeABI`


---

## myContract method

- clone
- deploy
- methods
  - methods.myMethod.call
  - methods.myMethod.sendBlock
  - methods.myMethod.encodeABI

---

## clone

Clone a current same contract instance

The cloned instance has nothing to do with the source instance, and changes to the cloned instance will not affect the source instance;

```js
myContract.clone(); //No parameters
```

### return value

New contract instance

### Example

```js
let contract1 = new mcp.Contract(abi, account, {gas_price: '12345678', from: fromAddress});

let contract2 = contract1.clone();
contract2.options.account = account2;

(contract1.options.account !== contract2.options.account);
> true
```



---

## deploy

Call this function, the contract will be deployed to the blockchain;

```js
myContract.deploy({
  data: '',
  arguments: []
});
```

### parameter

- `options` \<Object>: Options used for deployment.
  - `data` \<String>: The byte code of the contract.
  - `arguments` \<Array> (optional): The parameters passed to the constructor during deployment.

### return value

Object: Transaction object:

- `arguments` \<Array>: The parameters previously passed to the method. They can change.
- `sendBlock` \<Function>: Deploy the contract to the chain.
- `encodeABI` \<Function>: Encode the deployed ABI, that is, contract data + constructor parameters.

### Example

**sendBlock**

```js
//sendBlock promise
myContract
  .deploy({
    data: bytecode
  })
  .sendBlock({
    from: 'mcp_account',
    gas: 3000000,
    gas_price: '1000000000'
  })
  .then(data => {
    console.log('data', data);
  })
  .catch(function(error) {
    console.log('error', error);
  });

//sendBlock callback
myContract
  .deploy({
    data: bytecode
  })
  .sendBlock(
    {
      from: 'mcp_account',
      gas: 3000000,
      gas_price: '1000000000'
    },
    function(error, transactionHash) {
      console.log('error ==> ', error);
      console.log('transactionHash ==> ', transactionHash);
    }
  );

```

**encodeABI**

```js
// encodeABI
myContract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
})
    .encodeABI();

> '0x12345...0000012345678765432'

```



---

## methods

```js
myContract.methods.myMethod([param1[, param2[, ...]]])
```

`myMethod` is a method name, which depends on the JSON interface. The contract method can be called in the following ways

- Name: `myContract.methods.myMethod(123)`
- Name with parameters: `myContract.methods['myMethod(uint256)'](123)`
- Signature: `myContract.methods['0x58cf5f10'](123)`

Allows to call functions with the same name but different parameters

### Parameters

The parameters of any method depend on the parameter requirements in the `json interface`

### return

Object: Transaction object:

- `arguments` \<Array>: The parameters previously passed to the method. They can change.
- `call` \<Function>: Call the "constant" method instead of sending a transaction (does not change the state of the smart contract)!
- `sendBlock` \<Function>: Send the transaction to the chain (change the state of the smart contract)!
- `encodeABI` \<Function>: Encode ABI for this method



---

## methods.myMethod.call

`myContract.methods.myMethod([param1[, param2[, ...]]]).call(options[, callback])`

### Parameters

- `options` \<Object>: options for call.
  - `from` \<String>: from account.
- `callback` \<Function>: Use the result of the smart contract method execution as the second parameter or use the error object as the first parameter to trigger this callback.

### return

`Promise` object;

```js
//promise
myContract.methods.testCall1().call()
    .then(data => {
        console.log('testCall1 data', data)
    })
    .catch(function (error) {
        console.log('error', error)
    });


//callback
myContract.methods.testCall1().call(function(error, result){
    ...
})
```



---

## methods.myMethod.sendBlock

The transaction will be sent to the smart contract and execute its method; (will change the state of the contract)

### Parameters

- `options` \<Object>: Options used for call.
  - `from` \<String>: from account number.
  - `gas_price` \<String>: The gas price of wei used for this transaction.
  - `gas` \<String>| \<Number>: The maximum Gas (Gas limit) provided for this transaction.
  - `value` The value transmitted by the `Number | String | BN | BigNumber` transaction.
- `callback` \<Function>: Use the result of using the smart contract method as the second parameter or use the error object as the first parameter to trigger this callback;
  - Return transaction hash value

### return

\<Promise> Returns the transaction receipt.

### Example

```js

// promise
myContract.methods.myMethod(123).sendBlock({from: 'mcp_account'})
    .then(function(receipt){
        // Transaction receipt
    });

// callback
myContract.methods.myMethod(123).sendBlock({from: 'mcp_account'}, function(error, transactionHash){
    ...
});

```



---

## methods.myMethod.encodeABI

```js
myContract.methods.myMethod([param1[, param2[, ...]]]).encodeABI()
```

No parameters

### return

\<String>: The encoded ABI byte code sent by transaction or call.

### Example

```js
let encodeABIData = myContract.methods.myMethod(123).encodeABI();
console.log(encodeABIData);
//'0x58cf5f1000000000000000000000000000000000000000000000000000000000000007B'
```



---
