import mongoose from "mongoose";
import PostModel from "@/server/schema/Post.model";

const runtimeConfig = useRuntimeConfig()
const MONGO_DB_URI = runtimeConfig.mongoDbURI;

export default defineEventHandler(async (event) => {
  try {
    await mongoose.connect(MONGO_DB_URI);
    console.log("Connected to MongoDB");
    const post = await PostModel.findOne().sort({ _id: -1 }).limit(1);
    if (!post) {
      throw createError({
        statusCode: 404,
        message: "Post not found",
      });
    }
    return post
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to get last post",
    });
  }
})
