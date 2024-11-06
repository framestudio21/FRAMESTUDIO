//  // app/api/getFiles/route.js

import { connectToMongoDB, Product, Photography, DigitalArt } from "@/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mongoID = searchParams.get("id");
  const uniqueID = searchParams.get("uniqueID");
  const type = searchParams.get("type");
  const currentID = searchParams.get("currentID");

  // Connect to MongoDB once
  await connectToMongoDB();

  try {
    // Return early if type is missing
    if (!type ) {
      return new Response(JSON.stringify({ error: "Type parameter is missing" }), {
        status: 400,
      });
    }

    // Determine the collection based on the type
    let collection;
    switch (type) {
      case "product":
        collection = Product;
        break;
      case "photography":
        collection = Photography;
        break;
      case "digitalart":
        collection = DigitalArt;
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid type parameter" }), {
          status: 400,
        });
    }

    // Single file fetching by mongoID and uniqueID
    if (mongoID && uniqueID) {
      const file = await collection.findOne({ _id: mongoID, uniqueID }).exec();
      if (file) {
        return new Response(JSON.stringify(file), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
      }
    }

    // Fetch all files if no ID is provided
    if (!currentID && !mongoID) {
      const files = await collection.find({}).sort({ uploadedAt: -1 }).exec();
      return new Response(JSON.stringify(files), { status: 200 });
    }

    // Fetch previous and next navigation items if currentID is provided
    if (currentID) {
      const currentItem = await collection.findById(currentID).exec();
      if (!currentItem) {
        return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
      }

      // Find previous and next navigation items
      const prevItems = await collection
        .find({ uploadedAt: { $lt: currentItem.uploadedAt } })
        .sort({ uploadedAt: -1 })
        .limit(1)
        .exec();

      const nextItems = await collection
        .find({ uploadedAt: { $gt: currentItem.uploadedAt } })
        .sort({ uploadedAt: 1 })
        .limit(1)
        .exec();

      // Find previous two card items (older uploads)
      const cardPrevItems = await collection
        .find({ uploadedAt: { $lt: currentItem.uploadedAt } })
        .sort({ uploadedAt: -1 })
        .limit(2)
        .exec();

      // Find next two card items (newer uploads)
      const cardNextItems = await collection
        .find({ uploadedAt: { $gt: currentItem.uploadedAt } })
        .sort({ uploadedAt: 1 })
        .limit(2)
        .exec();

      // Structure response data
      const result = {
        prevNav: prevItems.map((item) => ({
          id: item._id,
          type: item.type,
          title: item.title,
          uniqueID: item.uniqueID,
        })),
        nextNav: nextItems.map((item) => ({
          id: item._id,
          type: item.type,
          title: item.title,
          uniqueID: item.uniqueID,
        })),
        cardPrev: cardPrevItems.map((item) => ({
          id: item._id,
          type: item.type,
          title: item.title,
          uniqueID: item.uniqueID,
          file: item.file,
          category1: item.category1,
          category2: item.category2,
          category3: item.category3,
          clientdetails: item.clientdetails,
          description: item.description,
          details: item.details,
          uploadedAt: item.uploadedAt,
        })),
        cardNext: cardNextItems.map((item) => ({
          id: item._id,
          type: item.type,
          title: item.title,
          uniqueID: item.uniqueID,
          file: item.file,
          category1: item.category1,
          category2: item.category2,
          category3: item.category3,
          clientdetails: item.clientdetails,
          description: item.description,
          details: item.details,
          uploadedAt: item.uploadedAt,
        })),
      };

      return new Response(JSON.stringify(result), { status: 200 });
    }

    // Return error if no ID or currentID is provided
    return new Response(JSON.stringify({ error: "Missing ID or currentID parameter" }), {
      status: 400,
    });
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
