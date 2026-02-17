import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";
import albumModel from "../models/albumModel.js";

// ================= ADD SONG =================
const addSong = async (req, res) => {
  try {
    const { name, desc, album, lyrics } = req.body;

    if (!name || !desc) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    if (!req.files || !req.files.audio || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Audio and Image files are required",
      });
    }

    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];
    const videoFile = req.files.video ? req.files.video[0] : null;

    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    let videoUrl = null;
    if (videoFile) {
      const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
        resource_type: "video",
      });
      videoUrl = videoUpload.secure_url;
    }

    const totalSeconds = Math.floor(audioUpload.duration || 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const songData = {
      name,
      desc,
      duration: formattedDuration,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      video: videoUrl,
      lyrics: lyrics || "",
      album: album && album !== "none" && album !== "" ? album : null,
    };

    const song = await songModel.create(songData);

    if (song.album) {
      await albumModel.findByIdAndUpdate(song.album, {
        $push: { songs: song._id },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Song added successfully",
      song,
    });
  } catch (error) {
    console.error("ADD SONG ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding song",
    });
  }
};

// ================= LIST SONG =================
const listSong = async (req, res) => {
  try {
    const songs = await songModel.find({}).populate("album").sort({ order: 1 });

    return res.json({
      success: true,
      songs,
    });
  } catch (error) {
    console.error("LIST SONG ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= REMOVE SONG =================
const removeSong = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Song ID required",
      });
    }

    const song = await songModel.findByIdAndDelete(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    if (song.album) {
      await albumModel.findByIdAndUpdate(song.album, {
        $pull: { songs: song._id },
      });
    }

    return res.json({
      success: true,
      message: "Song removed successfully",
    });
  } catch (error) {
    console.error("REMOVE SONG ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= PLAY SONG =================
const playSong = async (req, res) => {
  try {
    const { id, gender } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Song ID required" });
    }

    let updateQuery = {
      $inc: { plays: 1 },
      $push: { playHistory: new Date() },
    };

    if (gender === "Male") {
      updateQuery.$inc.malePlays = 1;
    } else if (gender === "Female") {
      updateQuery.$inc.femalePlays = 1;
    }

    const song = await songModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    return res.json({
      success: true,
      message: "Play count & demographic updated",
      plays: song?.plays || 0,
    });
  } catch (error) {
    console.error("PLAY SONG ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE SONG ORDER =================
const updateSongOrder = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await songModel.findByIdAndUpdate(orderedIds[i], { order: i });
    }

    return res.json({
      success: true,
      message: "Song order updated successfully!",
    });
  } catch (error) {
    console.error("ORDER UPDATE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ બધા જ ફંક્શન એક્સપોર્ટ
export { addSong, listSong, removeSong, playSong, updateSongOrder };
