import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

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
