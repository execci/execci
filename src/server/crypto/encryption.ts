import crypto from 'crypto';
import { envGet } from 'src/shared/env';

const SESSION_SECRET = envGet('SESSION_SECRET', { throwIfNotFound: true });

const SECRET = SESSION_SECRET.slice(0, 32);
const ALGORITHM = 'aes-256-ctr';

export function encrypt(message: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET, iv);
  const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
  return `${encrypted.toString('hex')}.${iv.toString('hex')}`;
}

export function decrypt(encrypted: string): string {
  const [val, iv] = encrypted.split('.');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET,
    Buffer.from(iv, 'hex'),
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(val, 'hex')),
    decipher.final(),
  ]);
  return decrpyted.toString();
}
