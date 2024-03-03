// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
    interface Platform {
      env: {
        KV: KVNamespace;
        DB: D1Database;
        BUCKET: R2Bucket;
      };
      context: EventContext;
      caches: CacheStorage & { default: Cache };
    }
	}
}

export {};
