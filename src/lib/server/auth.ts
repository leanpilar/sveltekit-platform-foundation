import jwt from 'jsonwebtoken';
import { PRIVATE_JWT_SECRET } from '$env/static/private';

/**
 * Signs a lightweight runtime session token for an authenticated user identifier
 */
export function createSessionToken(userId: string): string {
	return jwt.sign({ sub: userId }, PRIVATE_JWT_SECRET || 'asd', { expiresIn: '1d' });
}
/**
 * Validates session token integrity to extract user metadata context
 */
export function verifySessionToken(token: string): { userId: string | unknown } | null {
	try {
		const payload = jwt.verify(token, PRIVATE_JWT_SECRET || 'asd') as jwt.JwtPayload;
		return { userId: payload.sub };
	} catch {
		return null;
	}
}
