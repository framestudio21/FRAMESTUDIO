// pages/api/deleteFile.js
// C:\Users\duary\Desktop\next\framestudio\app\api\deleteFile\route.js

import { connectToMongoDB, Product, Photography, DigitalArt } from "@/lib/mongodb";

export async function DELETE(req, res) {
  try {
    const { type, uniqueID } = await req.json(); // Updated to handle `req.json()` instead of `req.body`

    await connectToMongoDB();

    let deletedFile;
    if (type === "product") {
      deletedFile = await Product.findOneAndDelete({ uniqueID });
    } else if (type === "photography") {
      deletedFile = await Photography.findOneAndDelete({ uniqueID });
    } else if (type === "digitalart") {
      deletedFile = await DigitalArt.findOneAndDelete({ uniqueID });
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400 });
    }

    if (deletedFile) {
      return new Response(JSON.stringify({ message: "File deleted successfully" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
