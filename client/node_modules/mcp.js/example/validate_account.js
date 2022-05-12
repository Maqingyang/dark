const MCP = require("../src/index.js");
//let mcp = new MCP({dev:true});
const mcp = new MCP();

const kys ={
    "account":"mcp3RFxJcfLoDUUz4cXDRWfTQCosVWXg98Ku5EoBL8kGVhKdT1zza",
    "ciphertext":"153974E855EF9DE7B4F92C320BD871AFBB84373F03C99CAD4876FFF8BBB15179",
    "iv":"71E397BB05BA993F55FD648930EC4DB4",
    "kdf_salt":"6D4976EA471E9A4446ED94CCBF78E032"
};
//TODO Verify account
mcp.accounts.validateAccount(kys, 'pa55word').then(res => {
    console.log("Received result\n", res);
}).catch(err => {
    console.log("err===>",err);
});

// let keyStore = {
//     "account":"mcp3RFxJcfLoDUUz4cXDRWfTQCosVWXg98Ku5EoBL8kGVhKdT1zza",
//     "kdf_salt":"6D4976EA471E9A4446ED94CCBF78E032",
//     "iv":"71E397BB05BA993F55FD648930EC4DB4",
//     "ciphertext":"153974E855EF9DE7B4F92C320BD871AFBB84373F03C99CAD4876FFF8BBB15179"
// };
// mcp.request.accountImport(JSON.stringify(keyStore)).then((res)=>{
//     console.log("res",res);
// })
// .catch(error=>{
//     console.log("error",error);
// });

//TODO Decrypt account private key 9E91AC7B6E32AEB68A1AA5ECA5CBE24481B412CC129E15A0102D3A6003D2BA0A
// mcp.accounts.decrypt(keyStore,2222).then(res=>{
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

//Test
// let testfile ={
//     "account":"mcp3RFxJcfLoDUUz4cXDRWfTQCosVWXg98Ku5EoBL8kGVhKdT1zza","kdf_salt":"6D4976EA471E9A4446ED94CCBF78E032","iv":"71E397BB05BA993F55FD648930EC4DB4","ciphertext":"153974E855EF9DE7B4F92C320BD871AFBB84373F03C99CAD4876FFF8BBB15179"};
//
// mcp.accounts.decrypt(testfile,123456).then(res=>{
//     console.log("1.Decrypt the account and receive the result============= ",res);
//     console.log("Is the result the same",res ==="5E844EE4D2E26920F8B0C4B7846929057CFCE48BF40BA269B173648999630053");
//     return res
// }).catch(err=>{
//     console.log("decrypt err",err);
// }).then(function (privateKey) {
//     //TODO signature
//     // let blockHash='5E844EE4D2E26920F8B0C4B7846929057CFCE48BF40BA269B173648999630053';
//     // mcp.accounts.sign(blockHash,privateKey).then(signature=>{
//     //     //BBFE4DE008DE19C3178EABBAAF032319DDC493AE5E9174065A0E729945BA47CA9CAC6B6F5A509D8123FB1F4A62AD65D4B68E51A863E4BA7033696A89E1FD9C07
//     //     console.log("2.signature ",signature)
//     // }).catch(err=>{
//     //     console.log("sign err",err);
//     // })
// });