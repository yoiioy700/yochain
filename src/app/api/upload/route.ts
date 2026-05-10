import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error("IMGBB_API_KEY is missing!");
      // Fallback for local testing if API key is missing (only works locally)
      return NextResponse.json({ success: false, error: 'IMGBB_API_KEY not configured in Vercel env' }, { status: 500 });
    }

    // Convert to base64 for ImgBB
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString('base64');

    const formData = new FormData();
    formData.append('image', base64Image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ success: true, url: result.data.url });
    } else {
      console.error('ImgBB error:', result);
      return NextResponse.json({ success: false, error: 'Failed to upload to ImgBB' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
  }
}
