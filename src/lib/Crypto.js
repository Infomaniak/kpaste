const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const baseX = require('base-x')(BASE58);
const pako = require('pako');

class Crypto {
  key: String;

  vector: String;

  salt: String;

  static interation() {
    return 100000;
  }

  static keySize() {
    return 256;
  }

  static tagSize() {
    return 128;
  }

  constructor(key, vector, salt) {
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

  async crypt(text, password) {
    const derivedKey = await this.deriveKey(password);
    const message = await this.aesGcmEncrypt(text, derivedKey);

    return {
      key: Crypto.base58encode(this.key),
      vector: btoa(this.vector),
      salt: btoa(this.salt),
      message,
    };
  }

  async decrypt(text, password) {
    const derivedKey = await this.deriveKey(password);
    return this.aesGcmDecrypt(text, derivedKey);
  }

  static base58encode(input) {
    return baseX.encode(
      Crypto.stringToArraybuffer(input),
    );
  }

  async deriveKey(password) {
    let keyArray = Crypto.stringToArraybuffer(this.key);
    if (password.length > 0) {
      const passwordArray = Crypto.stringToArraybuffer(password);
      const newKeyArray = new Uint8Array(keyArray.length + passwordArray.length);
      newKeyArray.set(keyArray, 0);
      newKeyArray.set(passwordArray, keyArray.length);
      keyArray = newKeyArray;
    }

    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      keyArray,
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    );

    return window.crypto.subtle.deriveKey(
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

  static stringToArraybuffer(message) {
    let i: number;
    const messageArray = new Uint8Array(message.length);
    for (i = 0; i < message.length; i += 1) {
      messageArray[i] = message.charCodeAt(i);
    }
    return messageArray;
  }

  static utf16To8(message) {
    return encodeURIComponent(message).replace(
      /%([0-9A-F]{2})/g,
      (match, hexCharacter) => String.fromCharCode(`0x${hexCharacter}`),
    );
  }

  async aesGcmEncrypt(plaintext, derivedKey) {
    const alg = {
      name: 'AES-GCM',
      iv: Crypto.stringToArraybuffer(this.vector),
      tagLength: Crypto.tagSize(),
    };
    const message = Crypto.stringToArraybuffer(
      Crypto.utf16To8(plaintext),
    );

    const ctBuffer = await window.crypto.subtle.encrypt(
      alg,
      derivedKey,
      pako.deflate(message),
    );

    return btoa(
      Crypto.arraybufferToString(ctBuffer),
    );
  }

  static arraybufferToString(messageArray) {
    let i: number;
    const array = new Uint8Array(messageArray);
    let message = '';
    for (i = 0; i < array.length; i += 1) {
      message += String.fromCharCode(array[i]);
    }
    return message;
  }

  static getRandomBytes(length) {
    let i: number;
    let bytes = '';
    const byteArray = new Uint8Array(length);
    window.crypto.getRandomValues(byteArray);
    for (i = 0; i < length; i += 1) {
      bytes += String.fromCharCode(byteArray[i]);
    }
    return bytes;
  }

  static getPasteKey() {
    let newKey = window.location.hash.substring(1);

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

  static base58decode(input) {
    return Crypto.arraybufferToString(
      baseX.decode(input),
    );
  }

  static utf8To16(message) {
    return decodeURIComponent(
      message.split('').map(
        (character) => `%${(`00${character.charCodeAt(0).toString(16)}`).slice(-2)}`,
      ).join(''),
    );
  }

  async aesGcmDecrypt(ciphertext, derivedKey) {
    const alg = {
      name: 'AES-GCM',
      iv: Crypto.stringToArraybuffer(this.vector),
      tagLength: Crypto.tagSize(),
    };

    const plainBuffer = await window.crypto.subtle.decrypt(
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
