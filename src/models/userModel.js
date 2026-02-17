import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // 🚀 આ જાદુઈ લાઈન છે! આ એક જ ઈમેલથી બે વાર એકાઉન્ટ નહિ બનવા દે.
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
