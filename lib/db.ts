import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("MongoDB is already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("MongoDB is connecting, waiting for connection...");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!, {
      dbName: "nextrestapi",
      bufferCommands: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err: unknown) {
    console.error("Error connecting to MongoDB:", err);
    throw new Error("Failed to connect to MongoDB", { cause: err });
  }
};

export default connectDB;
