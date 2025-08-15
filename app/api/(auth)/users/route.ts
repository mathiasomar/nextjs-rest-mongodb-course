import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

export const GET = async () => {
  try {
    await connectDB();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: unknown) {
    return new NextResponse(
      "Error fetching users: " + (error as Error).message,
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connectDB();
    const user = new User(body);
    await user.save();
    return new NextResponse(
      JSON.stringify({ message: "User created successfully", user }),
      { status: 201 }
    );
  } catch (error: unknown) {
    return new NextResponse(
      "Error creating user: " + (error as Error).message,
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;

    await connectDB();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new username not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "User updated", user: updatedUser }),
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    return new NextResponse(
      "Error updating user: " + (error as Error).message,
      { status: 500 }
    );
  }
};
