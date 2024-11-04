// lib/mongodb.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const SALT_ROUNDS = 10;


const MONGODB_URI =
  process.env.MONGODB_URL ||
  "mongodb+srv://admin:admin@fstudiocluster.tmihq.mongodb.net/FrameStudioData?retryWrites=true&w=majority&appName=FSTUDIOCLUSTER";

// MongoDB connection
export async function connectToMongoDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
}

// Define schemas for product, photography, and digital art
const productSchema = new mongoose.Schema({
  title: String,
  type: String,
  name: String,
  file: String,
  uniqueID: String,
  details: String,
  category1: String,
  category2: String,
  category3: String,
  clientdetails: String,
  description: String,
  uploadedAt: { type: Date, default: Date.now },
});

const photographySchema = new mongoose.Schema({
  title: String,
  type: String,
  name: String,
  file: String,
  uniqueID: String,
  clientdetails: String,
  description: String,
  uploadedAt: { type: Date, default: Date.now },
});

const digitalArtSchema = new mongoose.Schema({
  title: String,
  type: String,
  name: String,
  file: String,
  uniqueID: String,
  category1: String,
  description: String,
  uploadedAt: { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
  name: String,
  city: String,
  phone: String,
  email: String,
  subject: String,
  imagereference: String,
  category: String,
  message: String,
  contactuniqueid: String, // Unique ID
  tokenID: String, // Token ID
  country: String,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "incomplete" },
  statusTimestamp: { type: Date, default: Date.now },
});

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create models for each schema
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
const Photography =
  mongoose.models.Photography ||
  mongoose.model("Photography", photographySchema);
const DigitalArt =
  mongoose.models.DigitalArt || mongoose.model("DigitalArt", digitalArtSchema);
  const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
  const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);


  // Middleware to hash password before saving the admin
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if the password is modified
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Function to generate unique ID
async function generateUniqueID(type) {
  const now = new Date();
  const year = now.getFullYear();
  const month = `0${now.getMonth() + 1}`.slice(-2); // Add leading zero for month
  const prefix = `${type}-${year}-${month}`;

  // Find the latest uploaded file with the same type, year, and month
  let lastFile;
  if (type === "product") {
    lastFile = await Product.findOne({
      type,
      uniqueID: { $regex: `^${prefix}` },
    })
      .sort({ uploadedAt: -1 })
      .exec();
  } else if (type === "photography") {
    lastFile = await Photography.findOne({
      type,
      uniqueID: { $regex: `^${prefix}` },
    })
      .sort({ uploadedAt: -1 })
      .exec();
  } else if (type === "digitalart") {
    lastFile = await DigitalArt.findOne({
      type,
      uniqueID: { $regex: `^${prefix}` },
    })
      .sort({ uploadedAt: -1 })
      .exec();
  }

  let newNumber = 2;
  if (lastFile) {
    const lastNumber = parseInt(lastFile.uniqueID.split("P")[1], 10);
    newNumber = lastNumber + 1;
  }

  // Generate the new unique ID in the format: type-year-month-PNNN
  const uniqueID = `${prefix}-P${String(newNumber).padStart(3, "0")}`;
  return uniqueID;
}

// Save file link to the appropriate collection based on type
export async function saveFileLink(fileData) {
  try {
    await connectToMongoDB(); // Ensure we are connected to the database

    // Generate a unique ID based on the type
    const uniqueID = await generateUniqueID(fileData.type);
    fileData.uniqueID = uniqueID;

    let file;
    if (fileData.type === "product") {
      file = new Product(fileData);
    } else if (fileData.type === "photography") {
      file = new Photography(fileData);
    } else if (fileData.type === "digitalart") {
      file = new DigitalArt(fileData);
    } else {
      throw new Error("Invalid file type");
    }

    await file.save();
    console.log("File link saved to MongoDB:", fileData);
  } catch (error) {
    console.error("Error saving file link to MongoDB:", error);
    throw error;
  }
}


export { Product, Photography, DigitalArt, Contact, Admin };