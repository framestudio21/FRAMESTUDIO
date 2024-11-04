// app/api/getPrevNext/route.js

import { connectToMongoDB, Product, Photography, DigitalArt } from "@/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const currentID = searchParams.get("currentID");
  const type = searchParams.get("type");

  await connectToMongoDB();

  try {
    // Check if type and currentID are provided
    if (!type || !currentID) {
      return new Response(JSON.stringify({ error: "Missing type or currentID parameter" }), {
        status: 400,
      });
    }

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

    // Find the current document
    const currentItem = await collection.findById(currentID).exec();
    if (!currentItem) {
      return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    }

    // Find the previous and next navigation items
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

    // Find the previous two card items (older uploads)
    const cardPrevItems = await collection
      .find({ uploadedAt: { $lt: currentItem.uploadedAt } })
      .sort({ uploadedAt: -1 })
      .limit(2)
      .exec();

    // Find the next two card items (newer uploads)
    const cardNextItems = await collection
      .find({ uploadedAt: { $gt: currentItem.uploadedAt } })
      .sort({ uploadedAt: 1 })
      .limit(2)
      .exec();

    // Structure response data
    const result = {
      prevNav: prevItems.map(item => ({
        id: item._id,
        type: item.type,
        title: item.title,
        uniqueID: item.uniqueID
      })) || [],
      nextNav: nextItems.map(item => ({
        id: item._id,
        type: item.type,
        title: item.title,
        uniqueID: item.uniqueID
      })) || [],
      cardPrev: cardPrevItems
        .slice(0, 2) // Limit to the last two items for previous items
        .map(item => ({
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
        })) || [],
      cardNext: cardNextItems
        .slice(0, 2) // Limit to the first two items for next items
        .map(item => ({
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
        })) || [],
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching previous/next items:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
