import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";

// ================= ADD ALBUM =================
const addAlbum = async (req, res) => {
  try {
    const { name, desc, bgColour } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });

    const album = await albumModel.create({
      name,
      desc,
      bgColour,
      image: upload.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Album added",
      album,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LIST ALBUM =================
const listAlbum = async (req, res) => {
  try {
    // 🚀 અહી sort({ order: 1 }) ઉમેર્યું છે જેથી આલ્બમ સાચા ક્રમમાં આવે
    const albums = await albumModel.find({}).sort({ order: 1 });
    res.json({ success: true, albums });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= REMOVE ALBUM =================
const removeAlbum = async (req, res) => {
  try {
    const { id } = req.body; // 🚀 પાછું req.body કર્યું છે જેથી frontend સાથે મેચ થાય

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Album ID required",
      });
    }

    const album = await albumModel.findByIdAndDelete(id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    res.json({
      success: true,
      message: "Album removed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}; // ✅ removeAlbum અહી પૂરું થાય છે!

// ================= UPDATE ALBUM ORDER =================
// 🚀 આ ફંક્શન હવે બહાર સ્વતંત્ર રીતે છે
const updateAlbumOrder = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
    for (let i = 0; i < orderedIds.length; i++) {
      await albumModel.findByIdAndUpdate(orderedIds[i], { order: i });
    }
    return res.json({
      success: true,
      message: "Album order updated successfully!",
    });
  } catch (error) {
    console.error("ORDER UPDATE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { addAlbum, listAlbum, removeAlbum, updateAlbumOrder };
