import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  const body = await request.json();
  const { public_id } = body;

  if (!public_id) {
    return new Response(
      JSON.stringify({ error: 'Public ID is required to delete image' }),
      { status: 400 }
    );
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Image deleted successfully' }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to delete image', details: result }),
        { status: 500 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete image', details: error.message }),
      { status: 500 }
    );
  }
}
