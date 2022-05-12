# RPC request

## accountBalance

Get the specified account balance

```
request.accountBalance
```

### Request parameters

| Field | Type | Description |
|---------|--------|------------|
| account | string | Specified account |

### Back to results

| Field | Type | Description |
|---------|--------|----------|
| code | string |-|
| msg | string |-|
| balance | string | Account balance |

**error code**

| Name | Description |
|------|---------------------------|
| 1 | Invalid account |
| 100 | Missing parameter account |



## accountBlockList

Get transaction details of a specified account

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.accountBlockList
```

### Request parameters

| Field | Type | Description |
|--------------|--------|-----------------------------------------------------|
| account | string | Specify query account |
| limit `optional` | string | Returns the upper limit of the transaction, if it exceeds the default 1000, the default 1000 |
| index `Optional` | string | The current query index, from next_index in the returned result, default is empty |

### Back to results

| Field | Type | Description |
|------------|--------|--------------|
| code | string |-|
| msg | string |-|
| blocks | string | Transaction details list |
| next_index | string | Query index |

**error code**

| Name | Description |
|------|------------------------------------------------|
| 1 | Invalid account |
| 2 | Invalid limit |
| 3 | Limit too large, it can not be large than 1000 |
| 4 | Invalid index |
| 5 | Index not found |
| 100 | Missing parameter |



## accountChangePwd

change Password

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.accountChangePwd
```

### Request parameters

| Field | Type | Description |
|---------|--------|----------------|
| account | string | Account to change password |
| oldPwd | string | Original account password |
| newPwd | string | New account password |

### Back to results

| Field | Type | Description |
|-------|--------|----------------------------------------|
| code | string |-|
| msg | string |-|
| valid | string | Verification result, 0: invalid format, 1: valid format. |

**error code**

| Name | Description |
|-------|--------|
| 1 | Invalid account |
| 2 | Account not found |
| 3 | Invalid new password! A valid password length must between 8 and 100 |
| 4 | Invalid new password! A valid password must contain characters from letters (a-Z, A-Z), digits (0-9) and special characters (!@#\$%^&\*) |
| 5 | Wrong old password |
| 100 | Missing parameter |



## accountCode

Return the compiled smart contract code for the given address (if any)

```
request.accountCode
```

### Request parameters

| Field | Type | Description |
|---------|--------|----------------|
| account | string | Specified contract account |

### Back to results

| Field | Type | Description |
|------|--------|------|
| msg | string |-|
| code | string |-|

**error code**

| Name | Description |
|------|-----------------|
| 1 | Invalid account |



## accountCreate

Generate account

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.accountCreate
```

### Request parameters

| Field | Type | Description |
|----------------------|--------|------------------------------------------------------------------------------|
| pwd | string | Generate account password |
| gen_next_work `optional` | number | Whether to pre-generate the work value for the first transaction of the generated account, 0: no pre-generated, 1: pre-generated. The default is 1. |

### Back to results

| Field | Type | Description |
|------|--------|-----------------------------|
| code | string | If the call is successful, the code return value is 0 |
| msg | string | If the call is successful, the return value of msg is ok |

**error code**

| Name | Description |
|------|------------|
| 1 | Password can not be empty |
| 2 | Invalid password! A valid password length must between 8 and 100 |
| 3 | Invalid password! A valid password must contain characters from letters (a-Z, A-Z), digits (0-9) and special characters (!@#\$%^&\*) |
| 100 | Missing parameter pwd |


## accountExport

Export account

```
request.accountExport
```

### Request parameters

| Field | Type | Description |
|---------|--------|------------|
| account | string | exported account |

### Back to results

| Field | Type | Description |
|------|--------|-----------------------------|
| code | string | If the call is successful, the code return value is 0 |
| msg | string | If the call is successful, the return value of msg is ok |
| json | object | json of export account |

**error code**

| Name | Description |
|------|-------------------|
| 1 | Invalid account |
| 2 | Account not found |



## accountImport

Import account

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.accountImport
```

### Request parameters

| Field | Type | Description |
|----------------------|--------|------------------------------------------------------------------------------|
| jsonFile | object | Import account json |
| gen_next_work `optional` | number | Whether to pre-generate the work value for the first transaction of the generated account, 0: no pre-generated, 1: pre-generated. The default is 1. |

### Back to results

| Field | Type | Description |
|---------|--------|-----------------------------|
| code | string | If the call is successful, the code return value is 0 |
| msg | string | If the call is successful, the return value of msg is ok |
| account | string | Imported account |

**error code**

| Name | Description |
|------|----------------------------|
| 1 | Invalid account |
| 2 | Invalid json |
| 100 | Missing parameter jsonFile |



## accountList

```
request.accountList
```

### Back to results

| Field | Type | Description |
|----------|--------|-------------------------------|
| code | string |-|
| msg | string |-|
| accounts | object | accounts: {string[]} account list |



## accountLock

Locked account

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.accountLock
```

### Request parameters

| Field | Type | Description |
|---------|--------|------------|
| account | string | locked account |
| pwd | string | password |

### Back to results

| Field | Type | Description |
|------|--------|-----------------------------|
| code | string | If the call is successful, the code return value is 0 |
| msg | string | If the call is successful, the return value of msg is ok |

**error code**

| Name | Description |
|------|-------------------|
| 1 | Invalid account |
| 2 | Account not found |
| 100 | Missing parameter |



## accountRemove

Delete account

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.accountRemove
```

### Request parameters

| Field | Type | Description |
|---------|--------|------------|
| account | string | deleted account |
| pwd | string | password |

### Back to results

| Field | Type | Description |
|------|--------|-----------------------------|
| code | string | If the call is successful, the code return value is 0 |
| msg | string | If the call is successful, the return value of msg is ok |

**error code**

| Name | Description |
|------|-------------------|
| 1 | Invalid account |
| 2 | Account not found |
| 3 | Wrong password |
| 100 | Missing parameter |



## accountUnlock

Unlock account

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.accountUnlock
```

### Request parameters

| Field | Type | Description |
|---------|--------|------------|
| account | string | Unlocked account |
| pwd | string | password |

### Back to results

| Field | Type | Description |
|------|--------|-----------------------------|
| code | string | If the call is successful, the code return value is 0 |
| msg | string | If the call is successful, the return value of msg is ok |

**error code**

| Name | Description |
|------|-------------------|
| 1 | Invalid account |
| 2 | Account not found |
| 3 | Wrong password |
| 100 | Missing parameter |



## accountValidate

Verify that the account format is legal

```
request.accountValidate
```

### Request parameters

| Field | Type | Description |
|------------|--------|--------------|
| accountVal | string | Account to be verified |

### Back to results

| Field | Type | Description |
|-------|--------|----------------------------------------|
| code | string |-|
| msg | string |-|
| valid | string | Verification result, 0: invalid format, 1: valid format. |



## accountsBalances

Get the balance of multiple accounts

```
request.accountsBalances
```

### Request parameters

| Field | Type | Description |
|---------|-------|----------------|
| account | Array | Specified multiple accounts |

### Back to results

| Field | Type | Description |
|----------|--------|------------------------------------|
| code | string |-|
| msg | string |-|
| balances | Object | balances {Object.<string, string>} |

**error code**

| Name | Description |
|------|---------------------------|
| 1 | Invalid account |
| 100 | Missing parameter account |



## call

Get contract status

```
request.call
```

### Request parameters

| Field | Type | Description |
|-------------|--------|-------------------------------------------------------------------------|
| from `optional` | strign | source account |
| to | strign | Target account |
| data `optional` | strign | contract code or data |
| mci `optional` | strign | mci, accepted values: "latest", "earliest" or numbers (such as: "1352"), the default is "latest" |

### Back to results

| Field | Type | Description |
|------|--------|------|
| cdoe | number |-|
| msg | string |-|

**error code**

| Name | Description |
|------|------------------------|
| 1 | Invalid from account |
| 2 | From account not found |
| 3 | Invalid to account |
| 4 | Invalid data format |
| 5 | Data size too large |
| 6 | Invalid mci format |
| 100 | Missing parameter |



## estimateGas

Estimated amount of GAS consumed by the transaction

```
request.estimateGas
```

### Request parameters

| Field | Type | Description |
|------------------|--------|----------------------------------------------------------------------------------|
| from `optional` | strign | source account |
| to `Optional` | strign | Target account |
| amount `optional` | strign | Amount, unit: 1\*10<sup>-18</sup>CCN |
| gas `optional` | strign | The upper limit of gas used to execute transactions |
| gas_price `optional` | strign | gas price, unit: 1\*10<sup>-18</sup>CCN/gas, handling fee = actual gas used \_ gas_price |
| data `Optional` | strign | Smart contract code or data, default is empty |
| mci `optional` | strign | mci, accepted values: "latest", "earliest" or numbers (such as: "1352"), the default is "latest" |

### Back to results

| Field | Type | Description |
|------|--------|--------------------|
| cdoe | number |-|
| msg | string |-|
| gas | string | Estimated gas consumption |

**error code**

| Name | Description |
|------|--------------------------------|
| 1 | Invalid from account |
| 2 | Invalid to account |
| 3 | Invalid amount format |
| 4 | Invalid gas format |
| 5 | Invalid data format |
| 6 | Data size too large |
| 7 | Invalid gas price format |
| 8 | Invalid mci format |
| 9 | IGas not enough or excute fail |
| 100 | Missing parameter |



## generateOfflineBlock

Generate an unsigned transaction, return transaction details,

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.generateOfflineBlock
```

### Request parameters

| Field | Type | Description |
|-----------------|--------|----------------------------------------------------------------------------------|
| previous `Optional` | string | The previous transaction hash of the source account, which can be used to replace transactions that cannot be packaged |
| from | string | source account |
| to | string | Target account |
| amount | string | Amount, unit: 1\*10<sup>-18</sup>CCN |
| gas | string | The upper limit of gas used to execute the transaction, the unused part will be returned to the source account |
| gas_price | string | Gas price, unit: 1\*10<sup>-18</sup>CCN/gas, handling fee = actual gas used \_ gas_price |
| data `Optional` | string | Smart contract code or data, default is empty |

### Back to results

| Field | Type | Description |
|-----------------|--------|----------------------------------------------------------------------------------|
| code | string |-|
| msg | string |-|
| hash | string | transaction hash |
| previous `Optional` | string | The previous transaction of the source account |
| from | string | source account |
| to | string | Target account |
| amount | string | amount |
| gas | string | The upper limit of gas used to execute the transaction, the unused part will be returned to the source account |
| gas_price | string | Gas price, unit: 1\*10<sup>-18</sup>CCN/gas, handling fee = actual gas used \_ gas_price |

**error code**

| Name | Description |
|------|-------------------------------|
| 1 | Invalid from account |
| 3 | Invalid to account |
| 4 | Invalid amount format |
| 5 | Invalid gas format |
| 6 | Invalid data format |
| 7 | Data size too large |
| 8 | Insufficient balance |
| 9 | Validate error |
| 10 | Compose error |
| 100 | Missing parameter transaction |
| 110 | transaction not valid |



## getBlock

Get transaction details

```
request.getBlock
```

### Request parameters

| Field | Type | Description |
|-------|-------|------------------------------------------|
| hashs | Array | Transaction hash list, non-existent hash corresponds to null |

### Back to results

| Field | Type | Description |
|--------|--------|----------|
| code | string |-|
| msg | string |-|
| blocks | Array | Transaction details |

**error code**

| Name | Description |
|------|---------------------|
| 1 | Invalid hash format |



## getBlockState

Get transaction details

```
request.getBlockState
```

### Request parameters

| Field | Type | Description |
|------|--------|----------|
| hash | string | transaction hash |

### Back to results

| Field | Type | Description |
|-------------|--------|----------------------------------------------------------------------------------------------------------------------------|
| code | string |-|
| msg | string |-|
| block_state | object | Transaction status details, if it does not exist, null, <br/> For more information, see https://github.com/mcp/mcp/wiki/JOSN-RPC#block_state |

**error code**

| Name | Description |
|------|---------------------|
| 1 | Invalid hash format |



## getBlockStates

Get transaction status in batches

```
request.getBlockStates
```

### Request parameters

| Field | Type | Description |
|-------|-------|----------|
| hashs | Array | Transaction hash |

### Back to results

| Field | Type | Description |
|--------------|--------|----------------|
| code | string |-|
| msg | string |-|
| block_states | Array | Transaction status details, if it does not exist, then null,<br/> For more information, see https://github.com/mcp/mcp/wiki/JOSN-RPC#block_states |

**error code**

| Name | Description |
|------|---------------------|
| 1 | Invalid hash format |



## logs

Get the event log generated by the smart contract.

```
request.logs(obj)
```

### Request parameters

| Field | Type | Description |
|------------|--------|--------------------------------------------------|
| obj `optional` | Object | `from_stable_block_index` / `account` / `topics` |


### Back to results

| Field | Type | Description |
|------|--------|------|
| code | string |-|
| msg | string |-|
| logs | Array | logs |

```
//Return success
{
    "code": 0,
    "msg": "OK",
    "logs": [
        {
            "address": "mcp3DG8FjYSAqkBNubcSVAAjAtSQ9Q2tWVNwPS8VHQ55XwWG4DsTS",
            "data": "0000000000000000000000000000000000000000000000000000000000000000",
            "topics": [
                "260823607ceaa047acab9fe3a73ef2c00e2c41cb01186adc4252406a47d73446"
            ]
        },
        {
            "address": "mcp3DG8FjYSAqkBNubcSVAAjAtSQ9Q2tWVNwPS8VHQ55XwWG4DsTS",
            "data": "0000000000000000000000000000000000000000000000000000000000000001",
            "topics": [
                "260823607ceaa047acab9fe3a73ef2c00e2c41cb01186adc4252406a47d73446"
            ]
        }
    ]
}

//Return failure
{
    "code": 3,
    "msg": "Invalid account"
}
```

## sendBlock

Send transaction

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.sendBlock
```

### Request parameters

| Field | Type | Description |
|-----------------|--------|----------------------------------------------------------------------------------|
| previous `Optional` | string | The previous transaction hash of the source account, which can be used to replace transactions that cannot be packaged |
| from | string | source account |
| to | string | Target account |
| amount | string | Amount, unit: 1\*10<sup>-18</sup>CCN |
| password | string | Source account password |
| gas | string | The upper limit of gas used to execute the transaction, the unused part will be returned to the source account |
| gas_price | string | Gas price, unit: 1\*10<sup>-18</sup>CCN/gas, handling fee = actual gas used \_ gas_price |
| data `Optional` | string | Smart contract code or data, default is empty |

### Back to results

| Field | Type | Description |
|------|--------|-----------|
| code | string |-|
| msg | string |-|
| hash | string | transaction hash |

**error code**

| Name | Description |
|------|-------------------------------|
| 1 | Invalid from account |
| 2 | From account not found |
| 3 | Invalid to account |
| 4 | Invalid amount format |
| 5 | Invalid gas format |
| 6 | Invalid data format |
| 7 | Data size too large |
| 9 | Account locked |
| 10 | Wrong password |
| 11 | Insufficient balance |
| 100 | Missing parameter transaction |
| 110 | transaction not valid |



## sendOfflineBlock

Send a signed transaction, the request parameter comes from the interface GENERATE_OFFLINE_BLOCK, and the transaction hash is returned,

Note: When the node is turned on, `enable_control` needs to be set to `true`

```
request.sendOfflineBlock
```

### Request parameters

| Field | Type | Description |
|-----------------|--------|----------------------------------------------------------------------------------|
| previous `Optional` | string | The previous transaction hash of the source account, which can be used to replace transactions that cannot be packaged |
| from | string | source account |
| to | string | Target account |
| amount | string | Amount, unit: 1\*10<sup>-18</sup>CCN |
| gas | string | The upper limit of gas used to execute the transaction, the unused part will be returned to the source account |
| gas_price | string | Gas price, unit: 1\*10<sup>-18</sup>CCN/gas, handling fee = actual gas used \_ gas_price |
| data `Optional` | string | Smart contract code or data, default is empty |
| signature | string | transaction signature |

### Back to results

| Field | Type | Description |
|-------|--------|----------|
| code | string |-|
| msg | string |-|
| block | string | Transaction details |

**error code**

| Name | Description |
|------|--------------------------|
| 1 | Invalid from account |
| 3 | Invalid to account |
| 4 | Invalid amount format |
| 5 | Invalid gas format |
| 6 | Invalid data format |
| 7 | Data size too large |
| 9 | Invalid previous format |
| 12 | Invalid signature format |
| 100 | Missing parameter |
| 110 | block not valid |



## signMsg

Signed message

```
request.signMsg
```

### Request parameters

| Field | Type | Description |
|------------|--------|------------|
| public_key | string | Signature public key |
| password | string | Public key password |
| msg | string | signed message |

### Back to results

| Field | Type | Description |
|-----------|--------|-----------|
| code | string |-|
| msg | string |-|
| signature | string | signature hash |

**error code**

| Name | Description |
|------|---------------------------|
| 1 | Invalid public key format |
| 2 | Invalid msg format |
| 3 | Wrong password |
| 100 | Missing parameter |



## stableBlocks

Get multiple transactions under a stable specified MCI

```
request.stableBlocks
```

### Request parameters

| Field | Type | Description |
|--------------|--------|-----------------------------------------------------------------|
| limit | number | Back to the transaction limit, the maximum is 1000 |
| index `Optional` | string | The stable_index of the first block, the next_index in the result can be taken, and the default is 0 |

### Back to results

| Field | Type | Description |
|------------|--------|-----------------------------------------------------|
| cdoe | number |-|
| msg | string |-|
| blocks | Array | Transaction status details |
| next_index | number | stable_index of the next block, null if there is no subsequent data |

**error code**

| Name | Description |
|------|------------------------------------------------|
| 1 | Invalid index format |
| 2 | Invalid limit format |
| 3 | Limit too large, it can not be large than 1000 |



## status

Get the largest stable main chain INDEX of the current node, the largest main chain INDEX

```
request.status
```

### Back to results

| Field | Type | Description |
|-------------------------|--------|----------------------------------------------------------------------------------------|
| cdoe | number |-|
| msg | string |-|
| syncing | number | 0: not synchronized, 1: synchronizing |
| last_mci | number | Maximum main chain index |
| last_stable_block_index | number | The index of the largest stable transaction, and the index of the stable transaction increases sequentially from 0, indicating the global order of each transaction after it has stabilized |



## stop

Stop program

```
request.stop
```

### Back to results

| Field | Type | Description |
|------|--------|------|
| cdoe | number |-|
| msg | string |-|



## version

Get the current node daemon version number, RPC version number, database version number

```
request.version
```

### Back to results

| Field | Type | Description |
|---------------|--------|------|
| cdoe | number |-|
| msg | string |-|
| version | string |-|
| rpc_version | string |-|
| store_version | string |-|



## witnessList

Get the list of witnesses

```
request.witnessList
```

### Back to results

| Field | Type | Description |
|--------------|--------|------------|
| cdoe | number |-|
| msg | string |-|
| witness_list | Array | Witness list |


