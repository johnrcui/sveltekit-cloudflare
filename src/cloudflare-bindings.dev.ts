import type { Handle } from '@sveltejs/kit';
import { shimKV, shimD1, shimR2, shimCacheStorage } from '$lib/server/cloudflare/shims';

/**
 * Middleware to shim the Cloudflare services for local development
 */
export const shimCloudflareBindings = (async ({ event, resolve }) => {
  event.platform = {
    env: {
      // Define and shim the Cloudflare service bindings
      // and update the `app.d.ts` to match
      KV: (await shimKV('KV')),
      DB: (await shimD1('DB')),
      BUCKET: (await shimR2('BUCKET')),
    },

    context: {
      waitUntil: <T>(promise: Promise<T>) => promise.catch((e) => console.error(e)),
    },

    caches: (await shimCacheStorage()) as unknown as App.Platform['caches'],
  };

  return resolve(event);
}) satisfies Handle;
