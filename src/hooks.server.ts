import { sequence } from '@sveltejs/kit/hooks';
import { shimCloudflareBindings } from './cloudflare-bindings.dev';

export const handle = sequence(
  shimCloudflareBindings,
  // add other hooks and middlewares here
);