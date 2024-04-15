import CryptoJS from "crypto-js";

const SECTRE_KEY = process.env.REACT_APP_CRYPT_KEY;
const IV_KEY = process.env.REACT_APP_IV_KEY;

// 암호화 함수
const encrypt = (message) => {
    const iv = CryptoJS.enc.Hex.parse(IV_KEY);
    const encrypted = CryptoJS.AES.encrypt(message, SECTRE_KEY, { iv: iv });
    return encrypted.toString();
}

// 복호화 함수
const decrypt = (encryptedMessage) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, SECTRE_KEY).toString(CryptoJS.enc.Utf8);
    return decrypted;
}

export { encrypt, decrypt }