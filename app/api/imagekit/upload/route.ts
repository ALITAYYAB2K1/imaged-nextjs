import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";
const imagekit: ImageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string,
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
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
