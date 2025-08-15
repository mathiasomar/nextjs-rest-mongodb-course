/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import Blog from "@/lib/models/blog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or Invalid user ID" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or Invalid category ID" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or Invalid blog ID" }),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (error: unknown) {
    return new NextResponse(
      "Error updating blog: " + (error as Error).message,
      { status: 500 }
    );
  }
};
