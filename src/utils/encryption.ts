import crypto from 'crypto';
import env from '../env';

const SECRET_KEY = env.ENCRYPTION_SECRET;
const IV_LENGTH = 16; // AES block size
const CIPHER_IV_SEPARATOR = '__IV__SEPARATOR__';

export function encryptData(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const joinedData = [encrypted, iv.toString('hex')].join(CIPHER_IV_SEPARATOR);

  return joinedData;
}

export function decryptData(encryptedString: string): string {
  const [encryptedData, ivHex] = encryptedString.split(CIPHER_IV_SEPARATOR);
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
