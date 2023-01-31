import CryptoJS from "crypto-js";

require("dotenv").config();

const key: string = process.env.crypto as string;

export default class Encyption {
  public static encrypt(message: string): string {
    return CryptoJS.AES.encrypt(message, key).toString();
  }

  public static decrypt(hashMessage: string): string {
    return CryptoJS.AES.decrypt(hashMessage, key).toString(CryptoJS.enc.Utf8);
  }
}
