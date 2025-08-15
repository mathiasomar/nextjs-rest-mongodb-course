/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "User id not found or invalid user ID" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Category id not found or invalid category ID",
        }),
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

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return new NextResponse(
        JSON.stringify({ message: "Failed to update category" }),
        {
          status: 500,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Category updated successfully!",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    return new NextResponse(
      "Error updating category: " + (error as Error).message,
      { status: 500 }
    );
  }
};
