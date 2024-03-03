/**
 * ! DO NOT MODIFY !
 *
 * This file is swapped for `cloudflare-bindings.dev.ts` in production builds
 *
 * @see `src/cloudflare-bindings.dev.ts`
 * @see `vite.config.ts`
 */

import type { Handle } from '@sveltejs/kit';

/**
 * Dummy platform shim for use in production builds
 */
export const shimCloudflareBindings = (async ({ event, resolve }) => resolve(event)) satisfies Handle;
