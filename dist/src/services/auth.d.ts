import type { Context, Next } from 'hono';
import type { Env } from '../types.js';
/**
 * Generates a SHA-256 hash from a plaintext API key.
 *
 * @param key - Plaintext API key.
 * @returns Hex-encoded SHA-256 hash string.
 */
export declare function hashApiKey(key: string): string;
/**
 * Ensures a default development tenant and API key exist in non-production environments.
 *
 * @returns Tenant ID and development API key.
 */
export declare function ensureDefaultTenant(): Promise<{
    tenantId: string;
    apiKey: string;
}>;
/**
 * Authentication middleware resolving Tenant ID from Bearer token or X-API-Key header.
 *
 * @param c - Hono context object containing request information.
 * @param next - Hono next middleware function.
 * @returns Response object or passes control to next middleware.
 */
export declare function authMiddleware(c: Context<Env>, next: Next): Promise<(Response & import("hono").TypedResponse<{
    error: string;
}, 401, "json">) | (Response & import("hono").TypedResponse<{
    error: string;
}, 403, "json">) | undefined>;
