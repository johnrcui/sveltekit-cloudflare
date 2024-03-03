import { sveltekit } from '@sveltejs/kit/vite';
import type { PluginOption, UserConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

/**
 * Custom Vite plugin to swap the Cloudflare bindings shim based on the environment.
 * 
 * @returns {PluginOption}
 */
function shimCloudflareBindings(): PluginOption {
  const isProduction = process.env.NODE_ENV === 'production';
  const shimDevPath = resolve(process.cwd(), 'src/cloudflare-bindings.dev.ts');
  const shimProdPath = resolve(process.cwd(), 'src/cloudflare-bindings.prod.ts');

  if (!isProduction) {
    return null;
  }

  // swap the dev shim for the prod shim in production builds
  return {
    name: 'shim-cloudflare-bindings',

    enforce: 'pre',

    async resolveId(source, importer, options) {
      const sourceInfo = await this.resolve(source, importer, { ...options, skipSelf: true });

      if (sourceInfo?.id === shimDevPath) {
        return shimProdPath;
      }

      return null;
    }
  };
}

export default defineConfig({
	plugins: [shimCloudflareBindings(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
}) satisfies UserConfig;
