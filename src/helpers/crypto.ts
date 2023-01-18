import CryptoJS from "crypto-js";

require("dotenv").config();

const key: string = process.env.crypto as string;

export const encrypt = (message: string) =>
  CryptoJS.AES.encrypt(message, key).toString();

export const decrypt = (hashMessage: string) =>
  CryptoJS.AES.decrypt(hashMessage, key).toString(CryptoJS.enc.Utf8);
