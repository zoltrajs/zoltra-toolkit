import { promises as fs } from "fs";
import path from "path";
import os from "os";

/**
 * Find the first occurrence of `filename` by walking up from `fromDir` (or cwd).
 * Returns the absolute path if found, otherwise null.
 */
export async function findUp(
  filename: string,
  fromDir = process.cwd()
): Promise<string | null> {
  let dir = path.resolve(fromDir);
  while (true) {
    const fullPath = path.join(dir, filename);
    try {
      await fs.stat(fullPath);
      return fullPath;
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) {
        // Reached root without finding the file
        return null;
      }
      dir = parent;
    }
  }
}

/**
 * Delay execution for a given number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an asynchronous function up to `attempts` times with optional backoff.
 * @param fn - The async function to retry
 * @param attempts - Maximum number of attempts
 * @param backoff - Delay in ms between retries (increases linearly)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number,
  backoff = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts) {
        await delay(backoff * i);
      }
    }
  }
  throw lastError;
}

/**
 * Map over a list of items with a concurrency limit.
 * @param list - Items to process
 * @param mapper - Async mapping function
 * @param concurrency - Max number of concurrent executions
 */
export async function pMap<T, U>(
  list: T[],
  mapper: (item: T) => Promise<U>,
  concurrency = Infinity
): Promise<U[]> {
  const result: U[] = [];
  const executing: Promise<void>[] = [];
  for (const item of list) {
    const p = (async () => {
      const res = await mapper(item);
      result.push(res);
    })();
    executing.push(p);
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      // Remove settled promises
      for (let i = executing.length - 1; i >= 0; i--) {
        executing.splice(i, 1);
      }
    }
  }
  await Promise.all(executing);
  return result;
}

/**
 * Create a temporary directory with an optional prefix.
 * Returns the path to the created directory.
 */
export async function createTempDir(prefix = "zt-"): Promise<string> {
  const base = os.tmpdir();
  return fs.mkdtemp(path.join(base, prefix));
}

/**
 * Temporarily override process.env variables during a synchronous or async callback.
 * Restores original env afterwards.
 * @param env - Key/value pairs to mock
 * @param fn - Function to execute
 */
export async function mockEnv<T>(
  env: Record<string, string>,
  fn: () => T | Promise<T>
): Promise<T> {
  const original = { ...process.env };
  Object.assign(process.env, env);
  try {
    return await fn();
  } finally {
    process.env = original;
  }
}

/**
 * Converts a string to a URL-friendly slug by removing spaces and special characters.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a random numeric ID of the specified length.
 *
 * @param {number} length - The length of the generated ID.
 * @returns {string} A randomly generated numeric string.
 *
 * @example
 * console.log(generateId(6)); // e.g., "839214"
 */
export const generateId = (length: number): string => {
  const numbers = "0123456789";
  return Array.from({ length }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  ).join("");
};
