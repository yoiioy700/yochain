import { ACTIONS_CORS_HEADERS } from '@solana/actions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = {
    rules: [
      {
        pathPattern: "/cv/*",
        apiPath: "/api/actions/tip/*"
      },
      {
        pathPattern: "/api/actions/**",
        apiPath: "/api/actions/**"
      }
    ]
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS
  });
}

export const OPTIONS = GET;
