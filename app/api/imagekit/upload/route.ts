import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

// Validate environment variables
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  throw new Error(
    `Missing required ImageKit environment variables. Please check:
    - NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: ${publicKey ? "✓" : "✗"}
    - IMAGEKIT_PRIVATE_KEY: ${privateKey ? "✓" : "✗"}
    - NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: ${urlEndpoint ? "✓" : "✗"}`
  );
}

const imagekit: ImageKit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const filename = formData.get("filename") as string;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const uniqueFilename = `${userId}/${timestamp}_${sanitizedFilename}`;

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: uniqueFilename,
      folder: "/projects",
    });

    const thumbnailUrl = imagekit.url({
      src: uploadResponse.url,
      transformation: [
        { width: 400, height: 300, crop: "maintain_ar", quality: 80 },
      ],
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      thumbnailUrl: thumbnailUrl,
      fileId: uploadResponse.fileId,
      width: uploadResponse.width,
      height: uploadResponse.height,
      size: uploadResponse.size,
      name: uploadResponse.name,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
