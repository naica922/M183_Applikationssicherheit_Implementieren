import { generateSecret as createSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';

const ISSUER = 'SecurePass';

export function generateSecret() {
  return createSecret();
}

// Builds the otpauth:// URI and a scannable QR code (e.g. for Google Authenticator).
export async function buildSetup(username, secret) {
  const otpauth = generateURI({ issuer: ISSUER, label: username, secret });
  const qrCode = await QRCode.toDataURL(otpauth);
  return { otpauth, qrCode };
}

export function verifyToken(secret, token) {
  try {
    return verifySync({ token: String(token), secret }).valid === true;
  } catch {
    return false;
  }
}
