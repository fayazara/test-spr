import mongoose from "mongoose";
import PostModel from "@/server/schema/Post.model";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const runtimeConfig = useRuntimeConfig();
const {
  replicateWebhookSecret: WEBHOOK_SECRET,
  s3AccessKeyId: S3_ACCESS_KEY_ID,
  s3SecretAccessKey: S3_SECRET_ACCESS_KEY,
  s3BucketUrl: S3_BUCKET_URL,
  mongoDbURI: MONGO_DB_URI,
} = runtimeConfig;

const s3Config = {
  region: "auto",
  endpoint: S3_BUCKET_URL,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
};

export default defineEventHandler(async (event) => {
  try {
    console.log("Webhook Triggered")
    const query = getQuery(event);
    const { secret, id } = query;

    // makes sure it's coming from Replicate and verified with the secret
    if (secret !== WEBHOOK_SECRET) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    await mongoose.connect(MONGO_DB_URI);
    console.log("Connected to MongoDB");

    const { output } = await readBody(event);

    if (!output) {
      throw createError({
        statusCode: 400,
        message: "Missing output",
      });
    }

    const replicateImageUrl = output[0];
    const imageBuffer = await downloadImage(replicateImageUrl);
    const s3Client = new S3Client(s3Config);

    const params = {
      Bucket: "spirals",
      Key: `posts/${id}.png`,
      Body: imageBuffer,
      ContentType: "image/png",
    };

    // Upload image to S3
    await s3Client.send(new PutObjectCommand(params));

    const uploadedUrl = `https://spirals.fayazahmed.com/spirals/posts/${id}.png`;

    // Update our database with the image URL. Yay 🎉
    await PostModel.findByIdAndUpdate(id, { image: uploadedUrl });

    return { ok: true, id, image: uploadedUrl };
  } catch (error) {
    console.error("Error uploading image to S3:", error);

    if (error.statusCode) {
      throw error;
    } else {
      throw createError({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }
});

async function downloadImage(replicateImageUrl) {
  const response = await fetch(replicateImageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }
  return await response.arrayBuffer();
}
