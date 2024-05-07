import MyCrypto  from './Crypto';
import Crypto from './Crypto';
import { describe, expect, it } from 'vitest';

describe('Crypto', () => {
    it('should be the same message', async () => {

        const password = 'testPassword';

        const crypto = new MyCrypto();
        console.log(crypto)
        
        const originalMessage = 'This is a test message';
        const encryptedMessage = await crypto.crypt(originalMessage, password);

        const crypt = new Crypto(
            crypto.key,
            atob(encryptedMessage.vector),
            atob(encryptedMessage.salt),
          );

        const decryptedMessage = await crypt.decrypt(encryptedMessage.message, password);
        expect(originalMessage).toBe(decryptedMessage);
    });
});