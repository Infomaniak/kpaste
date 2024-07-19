import pako from 'pako';
import base from 'base-x';

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const baseX = base(BASE58);

interface ICrypto {
  key: string;
  vector: string;
  salt: string;
}

export class Crypto implements ICrypto{
  key: string;
  vector: string;
  salt: string;
  
  static interation() {
    return 100000;
  }

  static keySize() {
    return 256;
  }

  static tagSize() {
    return 128;
  }

  constructor(key?: string, vector?: string, salt?: string) {
    if (key) {
      this.key = key;
    } else {
      this.key = Crypto.getRandomBytes(32);
    }

    if (vector) {
      this.vector = vector;
    } else {
      this.vector = Crypto.getRandomBytes(16);
    }

    if (salt) {
      this.salt = salt;
    } else {
      this.salt = Crypto.getRandomBytes(8);
    }
  }

  async crypt(text: string, password:string) {
    const derivedKey = await this.deriveKey(password);
    const message = await this.aesGcmEncrypt(text, derivedKey);

    return {
      key: Crypto.base58encode(this.key),
      vector: btoa(this.vector),
      salt: btoa(this.salt),
      message,
    };
  }

  async decrypt(text: string, password: string) {
    const derivedKey = await this.deriveKey(password);
    return this.aesGcmDecrypt(text, derivedKey);
  }

  static base58encode(input: string) {
    return baseX.encode(
      Crypto.stringToArraybuffer(input),
    );
  }

  async deriveKey(password: string) {
    let keyArray = Crypto.stringToArraybuffer(this.key);
    if (password.length > 0) {
      const passwordArray = Crypto.stringToArraybuffer(password);
      const newKeyArray = new Uint8Array(keyArray.length + passwordArray.length);
      newKeyArray.set(keyArray, 0);
      newKeyArray.set(passwordArray, keyArray.length);
      keyArray = newKeyArray;
    }

    const importedKey = await globalThis.crypto.subtle.importKey(
      'raw',
      keyArray,
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    );

    return globalThis.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: Crypto.stringToArraybuffer(this.salt),
        iterations: Crypto.interation(),
        hash: { name: 'SHA-256' },
      },
      importedKey,
      {
        name: 'AES-GCM',
        length: Crypto.keySize(),
      },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  static stringToArraybuffer(message: string) {
    let i;
    const messageArray = new Uint8Array(message.length);
    for (i = 0; i < message.length; i += 1) {
      messageArray[i] = message.charCodeAt(i);
    }
    return messageArray;
  }

  static utf16To8(message: string) {
    return encodeURIComponent(message).replace(
        /%([0-9A-F]{2})/g,
        (_, hexCharacter) => String.fromCharCode(parseInt(hexCharacter, 16))
    );
  }

  async aesGcmEncrypt(plaintext: string, derivedKey: CryptoKey) {
    const alg = {
      name: 'AES-GCM',
      iv: Crypto.stringToArraybuffer(this.vector),
      tagLength: Crypto.tagSize(),
    };
    const message = Crypto.stringToArraybuffer(
      Crypto.utf16To8(plaintext),
    );

    const ctBuffer = await globalThis.crypto.subtle.encrypt(
      alg,
      derivedKey,
      pako.deflate(message),
    );

    return btoa(
      Crypto.arraybufferToString(ctBuffer),
    );
  }

  static arraybufferToString(messageArray: ArrayBuffer) {
    let i;
    const array = new Uint8Array(messageArray);
    let message = '';
    for (i = 0; i < array.length; i += 1) {
      message += String.fromCharCode(array[i]);
    }
    return message;
  }

  static getRandomBytes(length: number) {
    let i;
    let bytes = '';
    const byteArray = new Uint8Array(length);
    globalThis.crypto.getRandomValues(byteArray);
    for (i = 0; i < length; i += 1) {
      bytes += String.fromCharCode(byteArray[i]);
    }
    return bytes;
  }

  static getPasteKey() {
    let newKey = globalThis.location.hash.substring(1);

    if (newKey === '') {
      throw new Error('no encryption key given');
    }

    // Some web 2.0 services and redirectors add data AFTER the anchor
    // (such as &utm_source=...). We will strip any additional data.
    const ampersandPos = newKey.indexOf('&');
    if (ampersandPos > -1) {
      newKey = newKey.substring(0, ampersandPos);
    }

    return Crypto.base58decode(newKey).padStart(32, '\u0000');
  }

  static base58decode(input: string) {
    return Crypto.arraybufferToString(
      baseX.decode(input),
    );
  }

  static utf8To16(message: string) {
    return decodeURIComponent(
      message.split('').map(
        (character) => `%${(`00${character.charCodeAt(0).toString(16)}`).slice(-2)}`,
      ).join(''),
    );
  }

  async aesGcmDecrypt(ciphertext: string, derivedKey: CryptoKey) {
    const alg = {
      name: 'AES-GCM',
      iv: Crypto.stringToArraybuffer(this.vector),
      tagLength: Crypto.tagSize(),
    };

    const plainBuffer = await globalThis.crypto.subtle.decrypt(
      alg,
      derivedKey,
      Crypto.stringToArraybuffer(atob(ciphertext)),
    );

    return Crypto.utf8To16(
      Crypto.arraybufferToString(pako.inflate(new Uint8Array(plainBuffer))),
    );
  }
}

export default Crypto;
