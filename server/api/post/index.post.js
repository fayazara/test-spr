import Replicate from "replicate";
import mongoose from "mongoose";
import PostModel from "@/server/schema/Post.model";

const runtimeConfig = useRuntimeConfig()
const MONGO_DB_URI = runtimeConfig.mongoDbURI;
const BASE_URL = runtimeConfig.baseUrl;
const WEBHOOK_URL = `${BASE_URL}api/webhook`;
const API_TOKEN = runtimeConfig.replicateApiToken;
const WEBHOOK_SECRET = runtimeConfig.replicateWebhookSecret;
const PATTERN_URL = "https://spirals.fayazahmed.com/spiral.png";
const QR_CODE_CONTENT = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const replicate = new Replicate({
  auth: API_TOKEN,
});

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event)
  if (!prompt) {
    throw createError({
      statusCode: 401,
      message: "Please enter a prompt",
    });
  }
  await mongoose.connect(MONGO_DB_URI)
  console.log("Connected to MongoDB")
  const dataToSave = {
    prompt: prompt,
    patternUrl: PATTERN_URL,
    image: "",
  }
  const post = new PostModel(dataToSave)
  const { id } = await post.save();
  if (id) {
    const options = {
      version:
        "75d51a73fce3c00de31ed9ab4358c73e8fc0f627dc8ce975818e653317cb919b",
      input: {
        prompt,
        qr_code_content: QR_CODE_CONTENT,
        image: PATTERN_URL,
        controlnet_conditioning_scale: 1,
        qrcode_background: "white",
      },
      webhook: `${WEBHOOK_URL}?id=${id}&secret=${WEBHOOK_SECRET}`,
      webhook_events_filter: ["completed"],
    }
    await replicate.predictions.create(options)
    return { ok: true, id };
  } else {
    throw createError({
      statusCode: 400,
      message: "Failed to create post",
    });
  }
})
