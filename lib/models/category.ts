import { Schema, models, model } from "mongoose";

const categorySchema = new Schema(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", categorySchema);

export default Category;
