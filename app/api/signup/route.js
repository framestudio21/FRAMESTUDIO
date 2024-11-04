
//app/api/signup/route.js

import { Admin } from "@/lib/mongodb";
import { connectToMongoDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req, res) {
  try {
    const { email, password } = await req.json(); // Correct way to get JSON body in the app router

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return new Response(
      JSON.stringify({ message: 'User registered successfully' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup API:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  }
}
