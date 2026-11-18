import { Hono } from 'hono';
import type { Env } from './types.js';
declare const app: Hono<Env, import("hono/types").BlankSchema, "/">;
export default app;
