import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    images: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },

    category: {
      type: Number,
      required: false,
    },

    keywords: {
      type: Array,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: false,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsSchema);

export default News;
