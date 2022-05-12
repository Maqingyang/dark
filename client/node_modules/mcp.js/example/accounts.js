const MCP = require("../src/index.js");
// const mcp = new MCP({ dev: true });
const mcp = new MCP();
//TODO Create an account
mcp.accounts.create(12345678).then(res => {
    console.log("Create an account and receive the result\n", res);//res.account
//     { account: 'mcp4swShBy9MzvFuE1nvNggTyCmMcLpUD96G8aNuSWXUgpTE6DT7x',
//   kdf_salt: '0AC7EB79F1EDE16FB8447C27F39D30EA',
//   iv: 'EDB45C148A66F06EC145A38CFCFBA82F',
//   ciphertext:
//    'FE593A496FF4677989FE75C8FE92AE46568F76F71BA6CF1213B3BB8D7C4DB95C' }
    // console.log("***********************");
    // console.log(`res.account:${JSON.stringify(res)}`);
    // console.log("***********************");
}).catch(err => {
    console.log("err===>", err);
});

const keyStore = {
    "account": "mcp4swShBy9MzvFuE1nvNggTyCmMcLpUD96G8aNuSWXUgpTE6DT7x",
    "kdf_salt": "A4881755C3D546578F1A4134BB511097",
    "iv": "037B8145D3B5045BCF17A12C929C7A84",
    "ciphertext": "DA299CFBDF1EB083F31FB55F3B870CEA70D8D92378C35C31AF0AB51F7DF0A26C"
};
mcp.request.accountImport(JSON.stringify(keyStore)).then((res)=>{
    console.log("accountImport res",res);
})
.catch(error=>{
    console.log("error",error);
});

//TODO Decrypt account private key 9E91AC7B6E32AEB68A1AA5ECA5CBE24481B412CC129E15A0102D3A6003D2BA0A
// mcp.accounts.decrypt(keyStore,12345678).then(res=>{
//     console.log("1.Decrypt the account and receive the result ",res);
//     return res
// }).catch(err=>{
//     console.log("decrypt err",err);
// }).then(function (privateKey) {
//     //TODO signature
//     let blockHash='5E844EE4D2E26920F8B0C4B7846929057CFCE48BF40BA269B173648999630053';
//     mcp.accounts.sign(blockHash,privateKey).then(signature=>{
//         //BBFE4DE008DE19C3178EABBAAF032319DDC493AE5E9174065A0E729945BA47CA9CAC6B6F5A509D8123FB1F4A62AD65D4B68E51A863E4BA7033696A89E1FD9C07
//         console.log("2.signature ",signature)
//     }).catch(err=>{
//         console.log("sign err",err);
//     })
// });

//decrypt passwd:12345678
const testfile0 = {
    account: 'mcp3QjwgyypfAurdyL7DvTBXqwBHf1KD6GkssFCXrkPoya9JRW2yC',
    kdf_salt: '6D6768C453FC8BAC78F01688CB9EC4BD',
    iv: '5DC7D3A8C4774EEADCD30C78F63876AC',
    ciphertext:
        '5BF823644D96DCD6D07F27666FA4BCB5F431BB222F54449AE29A2905AAB0E744'
};
mcp.accounts.decrypt(testfile0, 12345678).then(res => {
    console.log("1.Decrypt the account and receive the result============= ", res);
    console.log("Is the result the same", res === "E3324FB7576C4639C2289AE60BA95DAD37696680E794E5BB0512C09F59519C1C");
    return res;
}).catch(err => {
    console.log("decrypt err", err);
}).then(function (privateKey) {
    //TODO signature
    // let blockHash='5E844EE4D2E26920F8B0C4B7846929057CFCE48BF40BA269B173648999630053';
    // mcp.accounts.sign(blockHash,privateKey).then(signature=>{
    //     //BBFE4DE008DE19C3178EABBAAF032319DDC493AE5E9174065A0E729945BA47CA9CAC6B6F5A509D8123FB1F4A62AD65D4B68E51A863E4BA7033696A89E1FD9C07
    //     console.log("2.signature ",signature)
    // }).catch(err=>{
    //     console.log("sign err",err);
    // })
});

// console.log('decodeAccount', mcp.accounts.decodeAccount(testfile.account))

// signature
const account_keystore = {
    "account": "mcp3cBe51PNrT8AGjYUvihZPeTvr2nexvXUdeyetia2cDSWfsZGcg",
    "ciphertext": "32830681BB5A1AD44FFE30E18F75DAEDBB0071738A2ACE1666024B492D885FEA",
    "iv": "044D2FE2A3D81F7ED565A92082765155",
    "kdf_salt": "4F35571826BE4EA730CF93A83F38475C"
};
mcp.accounts.decrypt(account_keystore, '12345678')
    .then(privateKey => {
        console.log('privateKey', privateKey);
        const blockHash='5E844EE4D2E26920F8B0C4B7846929057CFCE48BF40BA269B173648999630053';
        mcp.accounts.sign(blockHash, privateKey)
            .then(signature => {
                console.log('signature', signature);
            })
            .catch(console.error);
    })
    .catch(console.error);
