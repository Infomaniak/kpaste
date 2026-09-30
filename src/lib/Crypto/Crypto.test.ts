import MyCrypto from './Crypto';
import Crypto from './Crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Crypto', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should be the same message', async () => {
        const password = 'testPassword';
        const crypto = new MyCrypto();
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

    it('should round-trip with UTF-8 password containing non-Latin characters', async () => {
        const password = 'SécuritéŁ';
        const crypto = new MyCrypto();
        const originalMessage = 'hello';
        const encryptedMessage = await crypto.crypt(originalMessage, password);
        const crypt = new Crypto(
            crypto.key,
            atob(encryptedMessage.vector),
            atob(encryptedMessage.salt),
        );
        const decryptedMessage = await crypt.decrypt(encryptedMessage.message, password);
        expect(originalMessage).toBe(decryptedMessage);
    });

    it('should reject decrypting with a collision password (Łukasz123 vs Aukasz123)', async () => {
        const password = 'Łukasz123';
        const collisionPassword = 'Aukasz123';
        const crypto = new MyCrypto();
        const originalMessage = 'Łukaszes secret';
        const encryptedMessage = await crypto.crypt(originalMessage, password);
        const crypt = new Crypto(
            crypto.key,
            atob(encryptedMessage.vector),
            atob(encryptedMessage.salt),
        );

        // Wrong password must reject
        await expect(crypt.decrypt(encryptedMessage.message, collisionPassword)).rejects.toThrow();

        // Correct password must succeed
        const decryptedMessage = await crypt.decrypt(encryptedMessage.message, password);
        expect(originalMessage).toBe(decryptedMessage);
    });

    it('should decrypt a legacy-encrypted paste via the fallback KDF', async () => {
        const password = 'Łukasz123';
        const c = new MyCrypto();
        const legacyKey = await c.deriveKeyLegacy(password);
        const ct = await c.aesGcmEncrypt('legacy secret', legacyKey);
        const d = new MyCrypto(c.key, c.vector, c.salt);
        const out = await d.decrypt(ct, password);
        expect(out).toBe('legacy secret');
    });

    it('should reject decrypting with a wrong password', async () => {
        const password = 'correct-horse';
        const crypto = new MyCrypto();
        const originalMessage = 'hello';
        const encryptedMessage = await crypto.crypt(originalMessage, password);
        const crypt = new Crypto(
            crypto.key,
            atob(encryptedMessage.vector),
            atob(encryptedMessage.salt),
        );
        await expect(crypt.decrypt(encryptedMessage.message, 'wrong')).rejects.toThrow();
    });

    it('should not retry the legacy fallback for a pure-ASCII password', async () => {
        const password = 'correct-horse';
        const crypto = new MyCrypto();
        const originalMessage = 'hello';
        const encryptedMessage = await crypto.crypt(originalMessage, password);
        const crypt = new Crypto(
            crypto.key,
            atob(encryptedMessage.vector),
            atob(encryptedMessage.salt),
        );
        const legacySpy = vi.spyOn(Crypto.prototype, 'deriveKeyLegacy');

        await expect(crypt.decrypt(encryptedMessage.message, 'wrong')).rejects.toThrow();
        await expect(crypt.decrypt(encryptedMessage.message, '')).rejects.toThrow();
        expect(legacySpy).not.toHaveBeenCalled();
    });

    it('should retry the legacy fallback for a non-ASCII password', async () => {
        const password = 'correct-horse';
        const crypto = new MyCrypto();
        const originalMessage = 'hello';
        const encryptedMessage = await crypto.crypt(originalMessage, password);
        const crypt = new Crypto(
            crypto.key,
            atob(encryptedMessage.vector),
            atob(encryptedMessage.salt),
        );
        const legacySpy = vi.spyOn(Crypto.prototype, 'deriveKeyLegacy');

        await expect(crypt.decrypt(encryptedMessage.message, 'Łukasz123')).rejects.toThrow();
        expect(legacySpy).toHaveBeenCalledTimes(1);
    });
});