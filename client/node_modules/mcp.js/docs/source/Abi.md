# Abi

## encodeEventSignature

Encode the event name as its ABI signature, which is a sha3 hash of the event name and parameters.

```
mcp.abi.encodeEventSignature(eventName);
```

### parameter

| Field      | Type            | Describe                                                                                                                                            |
| --------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| eventName | String / Object | Event name encoding. Or the JSON interface object of the event.<br/>If it is a string, it must be in the form `event(type,type,...)`，E.g：`myEvent(uint256,uint32[],bytes10,bytes)` |

### Return result

String - The ABI signature of the event.

### Example

```
let sign1 = mcp.abi.encodeEventSignature('myEvent(uint256,bytes32)');

let opt2 = {
    name: 'myEvent',
    type: 'event',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'bytes32',
        name: 'myBytes'
    }]
};
let sign2 = mcp.abi.encodeEventSignature(opt2);
```
