# Account

## create

Create Account

```
mcp.accounts.create(password)
    .then(res => {})
    .catch()
```

### Parameter

| Field     | Type   | Describe       |
| -------- | ------ | ---------- |
| password | String | Account password |

### Return result

A keystore file for a new account

### Example

```
mcp.accounts.create(123456).then(res => {
    console.log("Create an account and receive the result\n", res);//res.account
    console.log(`res.account:${JSON.stringify(res)}`);
}).catch(err => {
    console.log("err===>", err);
});
```

## validateAccount

Verify that the `keystore` file and password can be parsed normally

```
mcp.accounts.validateAccount(keystore,password)
    .then(res => {})
    .catch()
```

### Parameter

| Field     | Type   | Describe       |
| -------- | -------- | ---------- |
| keystore | Keystore | Account file   |
| password | String   | Account password |

### Return result

If the password can be unlocked, the `keystore` file returns `true`, otherwise it returns `false`

### Example

```
mcp.accounts.validateAccount(keystore,123456).then(res => {
    console.log("Result\n", res);
}).catch(err => {
    console.log("err===>", err);
});
```

## Decrypt

Use the `keystore` file and password to unlock the account private key

```
mcp.accounts.decrypt(keystore,password)
    .then(res => {})
    .catch()
```

### Parameter

| Field     | Type   | Describe       |
| -------- | -------- | ---------- |
| keystore | Keystore | Account file   |
| password | String   | Account password |

### Return result

If the password can be unlocked, the `keystore` file returns to the private key file, otherwise an error will be reported;

### Example

```
mcp.accounts.decrypt(keystore,123456).then(res => {
    console.log("Result\n", res);
}).catch(err => {
    console.log("err===>", err);
});
```

## Sign

Sign the transaction offline with a private key

```
mcp.accounts.sign(transHash,privateKey)
    .then(res => {})
    .catch()
```

### Parameter

| Field     | Type   | Describe       |
| ---------- | ------ | ----------------- |
| transHash  | String | Transaction to be signed Hash |
| privateKey | String | Account private key        |

### Return result

Signed value

### Example

```
mcp.accounts.decrypt(account_keystore, '1234qwer')
    .then(privateKey => {
        console.log('privateKey', privateKey)
        let blockHash='5E844EE4D2E26920F8B0C4B7846929057CFCE48BF40BA269B173648999630053';
        mcp.accounts.sign(blockHash, privateKey)
            .then(signature => {
                console.log('signature', signature)
            })
            .catch(console.error)
    })
    .catch(console.error)
```
