import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
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

    bgColour: {
      type: String,
      required: true,
    },

    // 🚀 હવે order એકદમ સાચી જગ્યાએ (બહાર) છે!
    order: {
      type: Number,
      default: Date.now,
    },

    image: {
      type: String,
      required: true,
    },

    // ✅ linked songs
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.album || mongoose.model("album", albumSchema);
