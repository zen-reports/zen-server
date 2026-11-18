import postgres from 'postgres';
import * as schema from './schema.js';
export declare const sql: postgres.Sql<{}>;
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
