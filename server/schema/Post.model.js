import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    patternUrl: {
      type: String,
      required: true,
    },
    image: String,
  },
  { timestamps: true }
);


export default mongoose.model("Post", schema)
