import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      rules: [
        {
          pathPattern: '/profile/*',
          apiPath: '/api/actions/endorse/*'
        },
        {
          pathPattern: '/api/actions/endorse/*',
          apiPath: '/api/actions/endorse/*'
        }
      ]
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding'
      }
    }
  );
}

export const OPTIONS = GET;
