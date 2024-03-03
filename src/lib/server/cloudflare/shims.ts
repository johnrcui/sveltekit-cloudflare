import { KVNamespace as MfKVNamespace } from '@miniflare/kv';
import { R2Bucket as MfR2Bucket } from '@miniflare/r2';
import { D1Database as MfD1Database, D1DatabaseAPI } from '@miniflare/d1';
import { Cache as MfCache } from '@miniflare/cache';
import { FileStorage } from '@miniflare/storage-file';

/**
 * Shim for Cloudflare KV
 * 
 * @param binding service binding name
 * @returns KVNamespace
 */
export const shimKV = async <T extends string>(binding: T) => {
  const storage = new FileStorage(`.data/KV/${binding}`);

  return new MfKVNamespace(storage) as unknown as KVNamespace<T>;
}

/**
 * Shim for Cloudflare D1 Database
 * 
 * @param binding service binding name
 * @returns D1Database
 */
export const shimD1 = async (binding: string) => {
  const storage = new FileStorage(`.data/D1/${binding}`);
  const sqliteDB = await storage.getSqliteDatabase();

  return new MfD1Database(new D1DatabaseAPI(sqliteDB)) as unknown as D1Database;
}

/**
 * Shim for Cloudflare R2
 * 
 * @param binding service binding name
 * @returns R2Bucket
 */
export const shimR2 = async (binding: string) => {
  const storage = new FileStorage(`.data/R2/${binding}`);

  return new MfR2Bucket(storage) as unknown as R2Bucket;
}

/**
 * Shim for Cloudflare CacheStorage
 * 
 * @returns CacheStorage
 */
export const shimCacheStorage = async () => {
  const storage = new FileStorage(`.data/cache/default`);

  return {
    default: new MfCache(storage),
    open: async (cacheName: string) => {
      const storage = new FileStorage(`.data/cache/${cacheName}`);

      return new MfCache(storage);
    }
  } as unknown as CacheStorage;
}
