import express from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum,
  updateAlbumOrder,
} from "../controllers/albumController.js";
import upload from "../middleware/multer.js";

const albumRouter = express.Router();

albumRouter.post("/add", upload.single("image"), addAlbum);
albumRouter.get("/list", listAlbum);

// 🚀 પાછું .post કર્યું છે જેથી frontend ની API સાથે મેચ થઈ જાય
albumRouter.post("/remove", removeAlbum);

// 🚀 આ લાઈન તારા કોડમાં રહી ગઈ હતી!
albumRouter.post("/update-order", updateAlbumOrder);

export default albumRouter;
