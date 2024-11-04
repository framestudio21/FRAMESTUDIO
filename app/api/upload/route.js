// api/upload/route.js

import { NextResponse } from "next/server";
import { uploadToGoogleDrive } from "@/lib/uploadToGoogleDrive"; // Adjust the path as needed

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const type = data.get("type");
    const title = data.get("title");
    const details = data.get("details");
    const category1 = data.get("category1");
    const category2 = data.get("category2");
    const category3 = data.get("category3");
    const clientdetails = data.get("clientdetails");
    const description = data.get("description");

    if (!file || !type || !title) {
      console.log("thumbnail, type or title not provided");
      return NextResponse.json(
        { error: "thumbnail, type or title not provided" },
        { status: 400 }
      );
    }

    console.log("File received:", file.name);
    const result = await uploadToGoogleDrive(
      file,
      type,
      title,
      details,
      category1,
      category2,
      category3,
      clientdetails,
      description
    );

    console.log("Upload result:", result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
