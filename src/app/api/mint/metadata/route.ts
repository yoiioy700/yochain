import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('n') || 'YoChain User';
  const role = searchParams.get('r') || 'Web3 Professional';
  const photo = searchParams.get('p') || 'https://yochain.io/default-avatar.png';

  const metadata = {
    name: `YoChain ID: ${name}`,
    description: `Official Onchain Resume and Identity for ${name}. Verified via YoChain.io.`,
    image: photo,
    attributes: [
      { trait_type: 'Role', value: role },
      { trait_type: 'Platform', value: 'YoChain' },
      { trait_type: 'Verified', value: 'True' }
    ],
    properties: {
      files: [{ uri: photo, type: 'image/png' }],
      category: 'image',
    }
  };

  return NextResponse.json(metadata);
}
