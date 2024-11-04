// app/api/login/route.js
import { connectToMongoDB, Admin } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json(); // Get JSON body from the request

  try {
    await connectToMongoDB();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET ||
        "e8ad46188b56c0b64a9b58262a0e114f8f777bee4e0ff35b7b5f72dda5786f40",
      { expiresIn: '1h' }
    );

    const response = new Response(
      JSON.stringify({ message: "Login successful!" }),
      { status: 200 }
    );

    const cookieOptions = [
      `token=${token}`,
      "HttpOnly",
      "Path=/",
      `SameSite=Strict`, // Ensures cookies are sent with top-level navigation
    ];

    if (process.env.NODE_ENV === "production") {
      cookieOptions.push("Secure"); // Only use Secure cookies in production (HTTPS)
    }

    response.headers.set("Set-Cookie", cookieOptions.join("; "));

    return response;
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
