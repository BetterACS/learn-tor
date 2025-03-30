import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  const body = await request.json();
  const { file } = body;

  if (!file) {
    return new Response(
      JSON.stringify({ error: 'No file provided' }),
      { status: 400 }
    );
  }

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: 'Cloudinary credentials are missing' }),
        { status: 500 }
      );
    }
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      timestamp,
      upload_preset: 'learn-tor',
      folder: 'learn-tor/',
      public_id: `custom-public-id-${Date.now()}`,
    };

    const signatureResponse = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/sign-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paramsToSign }),
    });

    const { signature } = await signatureResponse.json();

    console.log("signature: ", signature);

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate signature' }),
        { status: 500 }
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'learn-tor');
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', apiKey);
    formData.append('public_id', paramsToSign.public_id);
    formData.append('folder', paramsToSign.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();

    console.log("data: ", data);

    if (data.secure_url) {
      return new Response(
        JSON.stringify({ secure_url: data.secure_url }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to upload image to Cloudinary' }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return new Response(
      JSON.stringify({ error: 'Image upload failed' }),
      { status: 500 }
    );
  }
}
