import mongoose from "mongoose";
import PostModel from "@/server/schema/Post.model";

const runtimeConfig = useRuntimeConfig();
const { mongoDbURI: MONGO_DB_URI } = runtimeConfig;
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing id",
    });
  }
  await mongoose.connect(MONGO_DB_URI);
  console.log("Connected to MongoDB");
  const post = await PostModel.findById(id);
  if (!post) {
    throw createError({
      statusCode: 404,
      message: "Post not found",
    });
  }
  return post;
})
