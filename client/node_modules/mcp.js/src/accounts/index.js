"use strict";
const crypto = require("crypto");
const argon2 = require("argon2-wasm-pro");

const bip39 = require("bip39");
const HDKey = require("hdkey");
const secp256k1 = require("secp256k1");
const { keccak256 } = require("js-sha3");

const { getAddress } = require("../utils/helper/abi-coder/address");
const { arrayify } = require("../utils/helper/abi-coder/convert");

const toUint8Array = (hexString) => {
  return new Uint8Array(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};

/**
 * Encode an account with a public key
 * @param {string} publicKey
 * @returns {string} Account
 */
function encodeAccount(publicKey) {
  // Zero address, special treatment
  if (
    publicKey ===
    "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  ) {
    return "mcp_zero_address";
  }
  const pub = "0x" + publicKey;
  const newBytes = arrayify(pub);
  const kh = keccak256(newBytes);
  const account = "0x" + kh.substring(24);
  const result = getAddress(account);
  return result;
}

/**
 * Import account via mnemonic
 * @param {string} mnemonicWord
 * @param {string} accountPath
 * @returns {Promise<{account:string;private_key:string;mnemonic:string} | Error>}
 */
async function importAccountWithMnemonic(
  mnemonicWord,
  accountPath,
  accountIndex
) {
  if (typeof mnemonicWord != "string") {
    throw new Error(
      `Unexpected type at first args. Need string but get ${typeof mnemonicWord}.`
    );
  }
  return await createAccountWithoutPassword(
    mnemonicWord,
    accountPath,
    accountIndex
  );
}

/**
 * Create an account with a password
 * @param {string} mnemonicWord
 * @param {string} accountPath
 * @returns {Promise<{account:string;private_key:string;mnemonic:string} | Error>}
 */
async function createAccountWithoutPassword(
  mnemonicWord,
  accountPath,
  accountIndex
) {
  const mnemonic = mnemonicWord || bip39.generateMnemonic(128);
  const seed = await bip39.mnemonicToSeed(mnemonic, "");
  const master = HDKey.fromMasterSeed(seed);
  const account = master.derive(accountPath);
  const addr = account.deriveChild(accountIndex);
  const privateKey = addr.privateKey;
  return new Promise(function (resolve, reject) {
    try {
      const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
      const pub_hex = Buffer.from(publicKey, "hex")
        .toString("hex")
        .toUpperCase();
      const accFile = {
        account: encodeAccount(pub_hex),
        private_key: privateKey.toString("hex").toUpperCase(),
        mnemonic,
      };
      resolve(accFile);
    } catch (e) {
      reject(e);
    }
  }).catch((err) => {
    throw err;
  });
}

/**
 * Create an account
 * @param {string} password
 * @param {*} costNum
 * @param {string} privateKey
 * @returns {Promise<{account:string;kdf_salt:string;iv:string;ciphertext:string} | Error>}
 */
async function createAccount(password, costNum, privateKey) {
  const kdf_salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);
  privateKey = privateKey
    ? Buffer.from(privateKey.toUpperCase(), "hex")
    : crypto.randomBytes(32);

  // password hashing
  const kdfOption = {
    pass: password.toString(),
    salt: kdf_salt,
    type: argon2.argon2id,
    time: 1,
    mem: costNum,
    parallelism: 1,
    hashLen: 32,
    // raw: true,
    // version: 0x13
  };

  // eslint-disable-next-line no-useless-catch
  try {
    const derivePwd = await argon2.hash(kdfOption);
    // Encrypted private key
    // Encryption method aes-256-ctr
    const cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(derivePwd.hash.buffer),
      iv
    );
    const ciphertext = Buffer.concat([
      cipher.update(privateKey),
      cipher.final(),
    ]);
    const promise = new Promise(function (resolve, reject) {
      try {
        // Generate public key
        const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
        const pub_hex = Buffer.from(publicKey, "hex")
          .toString("hex")
          .toUpperCase();

        //clear privateKey for security, any better method?
        crypto.randomFillSync(Buffer.from(derivePwd.hash.buffer));
        crypto.randomFillSync(privateKey);

        const accFile = {
          account: encodeAccount(pub_hex),
          kdf_salt: kdf_salt.toString("hex").toUpperCase(),
          iv: iv.toString("hex").toUpperCase(),
          ciphertext: ciphertext.toString("hex").toUpperCase(),
        };
        resolve(accFile);
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  } catch (err) {
    throw err;
  }
}

/**
 * Decrypt an account
 * @param {object} keystore
 * @param {string} keystore.kdf_salt
 * @param {string} keystore.iv
 * @param {string} keystore.ciphertext
 * @param {string} keystore.account
 * @param {string} password
 * @param {*} costNum
 * @returns {Promise<string>}
 */
async function decryptAccount(keystore, password, costNum) {
  keystore.kdf_salt = Buffer.from(keystore.kdf_salt, "hex");
  keystore.iv = Buffer.from(keystore.iv, "hex");
  keystore.ciphertext = Buffer.from(keystore.ciphertext, "hex");

  const kdfOption = {
    pass: password.toString(),
    salt: keystore.kdf_salt,
    type: argon2.argon2id,
    time: 1,
    mem: costNum,
    parallelism: 1,
    hashLen: 32,
    // raw: true,
    // version: 0x13
  };

  // password hashing
  // eslint-disable-next-line no-useless-catch
  try {
    const derivePwd = await argon2.hash(kdfOption);
    // Decrypt private key from ciphertext
    const decipher = crypto.createDecipheriv(
      "aes-256-ctr",
      Buffer.from(derivePwd.hash.buffer),
      keystore.iv
    );
    const privateKey = Buffer.concat([
      decipher.update(keystore.ciphertext),
      decipher.final(),
    ]);
    return privateKey.toString("hex").toUpperCase();
  } catch (err) {
    throw err;
  }
}

/**
 *
 * @param {*} block
 * @param {string} privateKey
 * @returns {Promise<string>}
 */
async function signBlock(block, privateKey) {
  return new Promise(async (resolve, reject) => {
    try {
      block = toUint8Array(block);
      privateKey = toUint8Array(privateKey);
      const sig = secp256k1.ecdsaSign(block, privateKey);
      const signature =
        Buffer.from(sig.signature, "hex").toString("hex") +
        Buffer.from([sig.recid], "hex").toString("hex");
      resolve(signature);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Verify account
 * @param {object} keystore
 * @param {string} keystore.kdf_salt
 * @param {string} keystore.iv
 * @param {string} keystore.ciphertext
 * @param {string} keystore.account
 * @param {string} password
 * @param {*} costNum
 * @returns {Promise<boolean>}
 */
async function validateAccount(keystore, password, costNum) {
  const prv1 = await decryptAccount(keystore, password, costNum);
  return new Promise(function (resolve, reject) {
    try {
      const privateKey = Buffer.from(prv1.toUpperCase(), "hex");
      const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
      const pub_hex = Buffer.from(publicKey, "hex")
        .toString("hex")
        .toUpperCase();

      if (encodeAccount(pub_hex) === getAddress(keystore.account)) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
}

class Accounts {
  /**
   * Init Accounts
   * @param {boolean} dev Configuration Environment
   */
  constructor(dev) {
    // if (dev) {
    //     // test environment
    //     this.costNum = 256;
    // } else {
    this.costNum = 16 * 1024;
    // }
  }

  /**
   * create account
   * @param password - account password
   * @return {Promise{accountFile | Error}} - accountFile { account, kdf_salt, iv, ciphertext }
   * */
  create(password) {
    if (password !== undefined) return createAccount(password, this.costNum);
  }

  /**
   * Create an account with a password
   * @param {string} accountPath
   * @returns {Promise<{account:string;private_key:string;mnemonic:string} | Error>}
   */
  async createWithoutMnemonic(accountPath) {
    if (accountPath) {
      return await createAccountWithoutPassword(false, accountPath, 0);
    }
  }

  /**
   * Import account via mnemonic
   * @param {string} mnemonicWord
   * @param {string} accountPath
   * @returns {Promise<{account:string;private_key:string;mnemonic:string} | Error>}
   */
  async importWithMnemonic(mnemonicWord, accountPath, accountIndex = 0) {
    if (mnemonicWord && accountPath) {
      return await importAccountWithMnemonic(
        mnemonicWord,
        accountPath,
        accountIndex
      );
    }
  }

  /**
   * Create account with private key
   * @param {*} password
   * @param {*} privateKey
   * @returns {Promise<{account:string;kdf_salt:string;iv:string;ciphertext:string} | Error>}
   */
  async createByPrivate(password, privateKey) {
    if (!privateKey) {
      return "Private key not found";
    }
    return await createAccount(password, this.costNum, privateKey);
  }

  /**
   * Get account through private key
   * @param {string} privateKey
   * @returns {Promise<string>}
   */
  async getAccountByPrivate(privateKey) {
    if (!privateKey) {
      return "Private key not found";
    }
    privateKey = Buffer.from(privateKey.toUpperCase(), "hex");
    return new Promise(function (resolve, reject) {
      try {
        // Create publicKey
        const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
        const pub_hex = Buffer.from(publicKey, "hex")
          .toString("hex")
          .toUpperCase();
        resolve(encodeAccount(pub_hex));
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Verify the keystore file
   * @param {object} keystore
   * @param {string} keystore.kdf_salt
   * @param {string} keystore.iv
   * @param {string} keystore.ciphertext
   * @param {string} keystore.account
   * @param {string} password
   * @returns {Promise<boolean>} Validation results
   */
  validateAccount(keystore, password) {
    return validateAccount(keystore, password, this.costNum);
  }

  /**
   * Decrypt account private key
   * @param {object} keystore
   * @param {string} keystore.kdf_salt
   * @param {string} keystore.iv
   * @param {string} keystore.ciphertext
   * @param {string} keystore.account
   * @param {string} password
   * @returns {string} privateKey
   */
  async decrypt(keystore, password) {
    const isValidate = await validateAccount(keystore, password, this.costNum);
    if (isValidate) {
      return decryptAccount(keystore, password, this.costNum);
    } else {
      throw new Error("Parameter (password)'s value invalid");
    }
  }

  /**
   * Get signature
   * @param {*} block
   * @param {string} privateKey
   * @returns {string} signature
   */
  async sign(block, privateKey) {
    return await signBlock(block, privateKey);
  }
}

module.exports = Accounts;
