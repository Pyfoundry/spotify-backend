import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      required: true,
      trim: true,
    },

    // album is OPTIONAL
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "album",
      default: null,
    },

    image: {
      type: String,
      required: true,
    },

    file: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    video: { type: String, default: "" },

    // ✅ FIX: lyrics must be INSIDE schema object
    lyrics: {
      type: String,
      default: "",
    },

    plays: {
      type: Number,
      default: 0,
    },

    playHistory: {
      type: Array,
      default: [],
    },

    // 🚀 આ બધાને મેં playHistory ની બહાર કાઢી લીધા છે!
    malePlays: {
      type: Number,
      default: 0,
    },

    femalePlays: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.models.song || mongoose.model("song", songSchema);
