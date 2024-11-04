// api/contact/route.js

import { connectToMongoDB } from "@/lib/mongodb";
import { Contact } from "@/lib/mongodb";
import mongoose from 'mongoose'; // Ensure mongoose is imported


// Helper function to generate unique IDs
async function generateUniqueID(category) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const categoryPrefix = category.charAt(0).toUpperCase();
    
    // Find the latest contact based on category
    const lastContact = await Contact.findOne({
        contactuniqueid: { $regex: `^${category}-${year}-${month}-${day}` }
    }).sort({ timestamp: -1 }).exec();

    let counter = 1;
    if (lastContact) {
        const lastCounter = parseInt(lastContact.contactuniqueid.split('-C')[1], 10);
        counter = lastCounter + 1;
    }

    const newId = `${category}-${year}-${month}-${day}-C${String(counter).padStart(3, "0")}`;
    const tokenID = `ref${year}${month}${day}${categoryPrefix}${String(counter).padStart(3, "0")}`;

    return { newId, tokenID };
}

// GET function to retrieve all contacts
export async function GET(req) {
    try {
        await connectToMongoDB();
        const contacts = await Contact.find({}).exec(); // Fetch all contacts
        return new Response(JSON.stringify(contacts), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch contacts", error: error.message }),
            { status: 500 }
        );
    }
}

// POST function to save a new contact
export async function POST(req) {
    try {
        await connectToMongoDB();
        const contactData = await req.json();

        // Generate unique IDs
        const { newId, tokenID } = await generateUniqueID(contactData.category);
        contactData.contactuniqueid = newId;
        contactData.tokenID = tokenID;

        // Set initial status as "incomplete"
        contactData.status = "incomplete";
        contactData.statusTimestamp = new Date().toISOString();

        const newContact = new Contact(contactData);
        await newContact.save();

        return new Response(
            JSON.stringify({ message: "Contact saved successfully", contactuniqueid: newId, tokenID: tokenID }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to save contact", error: error.message }),
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        await connectToMongoDB();
        
        // Parse the request body to get contactuniqueid, tokenID, status, and statusTimestamp
        const { contactuniqueid, tokenID, status, statusTimestamp } = await req.json();
        
        console.log("Updating contact:", contactuniqueid, "with status:", status, "and token ID:", tokenID);

        // Ensure both IDs and status are provided
        if (!contactuniqueid || !tokenID || !status) {
            return new Response(
                JSON.stringify({ message: "Contact unique ID, token ID, or status not provided" }),
                { status: 400 }
            );
        }

        // Find and update the contact by both contactuniqueid and tokenID
        const updatedContact = await Contact.findOneAndUpdate(
            { contactuniqueid, tokenID },
            { status, statusTimestamp },
            { new: true } // Return the updated document
        );

        if (!updatedContact) {
            return new Response(
                JSON.stringify({ message: "Contact not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Status updated successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update status", error: error.message }),
            { status: 500 }
        );
    }
}




// DELETE function to delete a contact by unique ID and token ID
export async function DELETE(req) {
    try {
        await connectToMongoDB();
        
        // Parse the request body to get contactuniqueid and tokenID
        const { contactuniqueid, tokenID } = await req.json();
        
        console.log("Deleting contact with unique ID:", contactuniqueid, "and token ID:", tokenID);

        // Ensure both IDs are provided
        if (!contactuniqueid || !tokenID) {
            return new Response(
                JSON.stringify({ message: "Contact unique ID or token ID not provided" }),
                { status: 400 }
            );
        }

        // Find and delete the contact by both contactuniqueid and tokenID
        const deletedContact = await Contact.findOneAndDelete({
            contactuniqueid: contactuniqueid,
            tokenID: tokenID,
        });

        // If deletedContact is null, it means the contact was not found
        if (!deletedContact) {
            return new Response(
                JSON.stringify({ message: "Contact not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Contact deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete contact", error: error.message }),
            { status: 500 }
        );
    }
}
