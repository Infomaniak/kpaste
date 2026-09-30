import MyCrypto from './Crypto';
import Crypto from './Crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import legacyPastes from '../../../cypress/fixtures/legacy_kdf_pastes.json';

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

describe('Crypto migration compatibility', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Invariant justifying the pure-ASCII fast path: both password conversions
    // produce identical bytes, so the legacy retry cannot succeed for ASCII.
    it('encodes pure-ASCII passwords identically in both conversions', () => {
        const asciiPasswords = ['', 'correct-horse', 'p4ssw0rd!~ #42', '0123456789abcdef'];
        for (const password of asciiPasswords) {
            expect(Array.from(Crypto.passwordToBytes(password))).toEqual(
                Array.from(Crypto.stringToArraybuffer(password)),
            );
        }
    });

    it('decrypts a legacy paste with an ASCII password on the primary KDF only', async () => {
        const password = 'correct-horse';
        const c = new MyCrypto();
        const legacyKey = await c.deriveKeyLegacy(password);
        const ct = await c.aesGcmEncrypt('legacy ascii secret', legacyKey);
        const d = new MyCrypto(c.key, c.vector, c.salt);
        const legacySpy = vi.spyOn(Crypto.prototype, 'deriveKeyLegacy');

        const out = await d.decrypt(ct, password);
        expect(out).toBe('legacy ascii secret');
        expect(legacySpy).not.toHaveBeenCalled();
    });

    it('decrypts a legacy paste with an empty password', async () => {
        const c = new MyCrypto();
        const legacyKey = await c.deriveKeyLegacy('');
        const ct = await c.aesGcmEncrypt('legacy empty secret', legacyKey);
        const d = new MyCrypto(c.key, c.vector, c.salt);

        const out = await d.decrypt(ct, '');
        expect(out).toBe('legacy empty secret');
    });

    it('round-trips an empty password', async () => {
        const crypto = new MyCrypto();
        const originalMessage = 'no password needed';
        const encryptedMessage = await crypto.crypt(originalMessage, '');
        const crypt = new Crypto(
            crypto.key,
            atob(encryptedMessage.vector),
            atob(encryptedMessage.salt),
        );

        const decryptedMessage = await crypt.decrypt(encryptedMessage.message, '');
        expect(originalMessage).toBe(decryptedMessage);
    });

    it('rejects homoglyph passwords on pastes encrypted with the Unicode variant', async () => {
        const pairs: Array<[string, string]> = [
            ['Ł', 'A'], // U+0141 folded to U+0041 by the legacy conversion
            ['ā', '\u0001'], // U+0101 folded to U+0001
            ['ɐ', 'P'], // U+0250 folded to U+0050
            ['Ω', '©'], // U+03A9 folded to U+00A9
        ];
        for (const [unicodeChar, latinChar] of pairs) {
            // Precondition: the legacy conversion maps both chars to the same byte.
            expect(Array.from(Crypto.stringToArraybuffer(unicodeChar))).toEqual(
                Array.from(Crypto.stringToArraybuffer(latinChar)),
            );

            const unicodePassword = `${unicodeChar}pw`;
            const latinPassword = `${latinChar}pw`;

            const crypto = new MyCrypto();
            const encryptedMessage = await crypto.crypt('homoglyph secret', unicodePassword);
            const crypt = new Crypto(
                crypto.key,
                atob(encryptedMessage.vector),
                atob(encryptedMessage.salt),
            );
            // Pre-migration this succeeded (colliding keys); UTF-8 encoding must reject it.
            await expect(crypt.decrypt(encryptedMessage.message, latinPassword)).rejects.toThrow();
        }
    });

    it('accepts the legacy homoglyph equivalent on ASCII-password pastes (documented fallback ambiguity)', async () => {
        const pairs: Array<[string, string]> = [
            ['Ł', 'A'],
            ['ā', '\u0001'],
            ['ɐ', 'P'],
            ['ŀ', '@'], // U+0140 folded to U+0040
        ];
        for (const [unicodeChar, latinChar] of pairs) {
            const unicodePassword = `${unicodeChar}pw`;
            const latinPassword = `${latinChar}pw`;

            const crypto = new MyCrypto();
            const encryptedMessage = await crypto.crypt('homoglyph secret', latinPassword);
            const crypt = new Crypto(
                crypto.key,
                atob(encryptedMessage.vector),
                atob(encryptedMessage.salt),
            );
            // A pre-migration paste sealed with the Unicode variant and a current paste
            // sealed with the ASCII variant share the same key (legacy(Unicode) ===
            // utf8(ASCII)), so the legacy fallback cannot tell them apart.
            const decryptedMessage = await crypt.decrypt(encryptedMessage.message, unicodePassword);
            expect(decryptedMessage).toBe('homoglyph secret');
        }
    });

    it('round-trips passwords across multiple scripts', async () => {
        const passwords = ['SécuritéŁ123', '日本語パスワード', 'Пароль123', '🔒emoji-pass'];
        for (const password of passwords) {
            const crypto = new MyCrypto();
            const originalMessage = `secret for ${password}`;
            const encryptedMessage = await crypto.crypt(originalMessage, password);
            const crypt = new Crypto(
                crypto.key,
                atob(encryptedMessage.vector),
                atob(encryptedMessage.salt),
            );

            const decryptedMessage = await crypt.decrypt(encryptedMessage.message, password);
            expect(originalMessage).toBe(decryptedMessage);
        }
    });
});

describe('legacy fixtures sealed by the pre-migration code', () => {
    legacyPastes.pastes.forEach(({ name, password, text, key, vector, salt, message }) => {
        it(`decrypts the real pre-migration paste: ${name}`, async () => {
            const rawKey = Crypto.base58decode(key).padStart(32, '\u0000');
            const crypt = new Crypto(rawKey, atob(vector), atob(salt));

            const out = await crypt.decrypt(message, password);
            expect(out).toBe(text);
        });
    });
});