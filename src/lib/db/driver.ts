import { mkdirSync } from "node:fs";
import path from "node:path";

export type DbRow = Record<string, unknown>;

export type DbResult<T> = {
  rows: T[];
  rowCount: number;
};

export type DbQuery = <T = DbRow>(
  sql: string,
  params?: readonly unknown[],
) => Promise<DbResult<T>>;

export type DbTransaction = <T>(fn: (query: DbQuery) => Promise<T>) => Promise<T>;

export type DbDriver = {
  query: DbQuery;
  exec: (sql: string) => Promise<void>;
  transaction: DbTransaction;
  close: () => Promise<void>;
};

const globalForDb = globalThis as unknown as {
  __festejaDbDriver?: Promise<DbDriver>;
};

export function toPostgresPlaceholders(sql: string): string {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function normalizeParams(params?: readonly unknown[]): unknown[] {
  return (params ?? []).map((value) => (value === undefined ? null : value));
}

function connectionString(): string | undefined {
  const value =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim();
  return value || undefined;
}

function pgliteDataDir(): string | undefined {
  const configured = process.env.FESTEJA_PGLITE_DIR?.trim();
  if (configured) return path.resolve(configured);

  if (process.env.NEXT_PHASE === "phase-production-build") return undefined;

  const testPath = process.env.FESTEJA_DB_PATH?.trim();
  if (testPath) return `${path.resolve(testPath)}.pglite`;

  return path.join(process.cwd(), "data", "pglite");
}

async function createPostgresDriver(url: string): Promise<DbDriver> {
  const pg = await import("pg");
  const pool = new pg.Pool({
    connectionString: url,
    max: Number(process.env.FESTEJA_DB_POOL_SIZE ?? 3),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  pg.types.setTypeParser(20, (value) => Number(value));
  pg.types.setTypeParser(1700, (value) => Number(value));

  const query: DbQuery = async <T>(sql: string, params?: readonly unknown[]) => {
    const result = await pool.query(toPostgresPlaceholders(sql), normalizeParams(params));
    return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
  };

  const transaction: DbTransaction = async (fn) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await fn(async <T>(sql: string, params?: readonly unknown[]) => {
        const response = await client.query(
          toPostgresPlaceholders(sql),
          normalizeParams(params),
        );
        return { rows: response.rows as T[], rowCount: response.rowCount ?? 0 };
      });
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  };

  return {
    query,
    exec: async (sql) => {
      await pool.query(sql);
    },
    transaction,
    close: () => pool.end(),
  };
}

async function createPgliteDriver(): Promise<DbDriver> {
  const { PGlite } = await import("@electric-sql/pglite");
  const dataDir = pgliteDataDir();
  if (dataDir) mkdirSync(path.dirname(dataDir), { recursive: true });

  const client = dataDir ? new PGlite(dataDir) : new PGlite();
  await client.waitReady;

  const query: DbQuery = async <T>(sql: string, params?: readonly unknown[]) => {
    const result = await client.query(toPostgresPlaceholders(sql), normalizeParams(params));
    return {
      rows: result.rows as T[],
      rowCount: result.affectedRows ?? result.rowCount ?? 0,
    };
  };

  const transaction: DbTransaction = (fn) =>
    client.transaction((tx) =>
      fn(async <T>(sql: string, params?: readonly unknown[]) => {
        const result = await tx.query(
          toPostgresPlaceholders(sql),
          normalizeParams(params),
        );
        return {
          rows: result.rows as T[],
          rowCount: result.affectedRows ?? result.rowCount ?? 0,
        };
      }),
    );

  return {
    query,
    exec: async (sql) => {
      await client.exec(sql);
    },
    transaction,
    close: () => client.close(),
  };
}

async function createDriver(): Promise<DbDriver> {
  const url = connectionString();
  if (url) return createPostgresDriver(url);

  if (process.env.VERCEL && !process.env.FESTEJA_ALLOW_PGLITE) {
    throw new Error(
      "DATABASE_URL não configurada. Defina a conexão PostgreSQL antes de publicar na Vercel.",
    );
  }

  return createPgliteDriver();
}

export function getDriver(): Promise<DbDriver> {
  if (!globalForDb.__festejaDbDriver) {
    globalForDb.__festejaDbDriver = createDriver();
  }
  return globalForDb.__festejaDbDriver;
}

export async function resetDriver(): Promise<void> {
  const driver = globalForDb.__festejaDbDriver;
  globalForDb.__festejaDbDriver = undefined;
  if (!driver) return;
  await (await driver).close();
}
