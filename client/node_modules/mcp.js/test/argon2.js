const argon2 = require("argon2-wasm-pro");
const crypto = require("crypto");
const edPro = require("ed25519-wasm-pro");
// const ed25519 = require("ed25519");
const bs58check = require("bs58check");

// let kdf_salt    = crypto.randomBytes(16);
// let iv          = crypto.randomBytes(16);
// let privateKey  = crypto.randomBytes(32);
// let password = '12345678';

async function createAccount(opts, iv, privateKey) {
    opts.pass = opts.pass || '123456';
    opts.salt = opts.salt || Buffer.from("AF8460A7D28A396C62D6C51620B87789", "hex");
    opts.type = opts.type || argon2.argon2id;
    opts.time = opts.time || 1;
    opts.mem = opts.mem || 256;//256   16 * 1024  The test environment is 256
    opts.parallelism = opts.parallelism || 1;
    opts.hashLen = opts.hashLen || 32;

    const derive_pwd = await argon2.hash(opts);
    const derive_pwd_val = derive_pwd.hashHex.toUpperCase();
    // Encrypt private key, encryption method aes-256-ctr
    const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(derive_pwd.hash.buffer), iv);
    const ciphertext = Buffer.concat([cipher.update(privateKey), cipher.final()]);

    // Generate public key
    const promise = new Promise(function (resolve, reject) {
        try {
            edPro.ready(function () {
                // let keypair = ed25519.MakeKeypair(privateKey);
                // let pub = keypair.publicKey;

                const keys = edPro.createKeyPair(privateKey);
                // console.log("new ed", Buffer.from(keys.publicKey.buffer))
                const pub = Buffer.from(keys.publicKey.buffer);
                const kc = {
                    pub: pub,
                    kdf_salt: opts.salt,
                    iv: iv,
                    ciphertext: ciphertext
                };
                const ciphertextVal = kc.ciphertext.toString('hex').toUpperCase();

                const pubVal = kc.pub.toString('hex').toUpperCase();

                const account_c = encodeAccount(kc.pub);
                resolve(
                    {
                        "derive_pwd": derive_pwd_val,
                        "account": account_c,
                        "ciphertext": ciphertextVal,
                        "pub": pubVal
                    }
                );
            });
        } catch (e) {
            reject(e);
        }
    });
    return promise;
}


function encodeAccount(pub) {
    const version = Buffer.from([0x01]);
    const v_pub = Buffer.concat([version, pub]);
    const account = "mcp" + bs58check.encode(v_pub);
    return account;
}

/* 

kdf_salt:6D4976EA471E9A4446ED94CCBF78E032
password:pa55word
iv:71E397BB05BA993F55FD648930EC4DB4
prv:5E844EE4D2E26920F8B0C4B7846929057CFCE48BF40BA269B173648999630053

derive_pwd:B37318E4BF5F578E824D773963C2D0FE6FA5F8A94D7DDA6D98728DBE5B5E4D17

ciphertext:153974E855EF9DE7B4F92C320BD871AFBB84373F03C99CAD4876FFF8BBB15179
pub:34E85B176BE32EFAD87C9EB1EBFC6C54482A6BECBD297F9FDF3BFA8EA342162C
account:mcp3RFxJcfLoDUUz4cXDRWfTQCosVWXg98Ku5EoBL8kGVhKdT1zza
create_account: ok
*/
module.exports = createAccount;