import type { RequestHandler } from './$types';

export const GET = (async ({ platform }) => {
  const { BUCKET } = platform!.env;
  const file = await BUCKET.get('random-image');
  const headers = new Headers();

  file?.writeHttpMetadata(headers);

  return new Response(file?.body, { headers });
}) satisfies RequestHandler;