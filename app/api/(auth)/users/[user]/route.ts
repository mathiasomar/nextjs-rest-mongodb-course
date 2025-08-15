/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
  const userId = context.params.user;
  try {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
      });
    }

    await connectDB();

    const user = await User.findOne({ _id: new Types.ObjectId(userId) });
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ user }), { status: 200 });
  } catch (error: unknown) {
    return new NextResponse(
      "Error fetching user: " + (error as Error).message,
      { status: 500 }
    );
  }
};
