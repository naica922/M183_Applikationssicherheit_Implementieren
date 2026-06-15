import { authenticator } from 'otplib';
import QRCode from 'qrcode';

const ISSUER = 'SecurePass';

export function generateSecret() {
  return authenticator.generateSecret();
}

// Builds the otpauth:// URI and a scannable QR code (e.g. for Google Authenticator).
export async function buildSetup(username, secret) {
  const otpauth = authenticator.keyuri(username, ISSUER, secret);
  const qrCode = await QRCode.toDataURL(otpauth);
  return { otpauth, qrCode };
}

export function verifyToken(secret, token) {
  return authenticator.verify({ token, secret });
}
