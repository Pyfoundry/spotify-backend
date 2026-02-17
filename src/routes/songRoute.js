import express from "express";
import {
  addSong,
  listSong,
  removeSong,
  playSong,
  updateSongOrder,
} from "../controllers/songcontrollers.js";
import upload from "../middleware/multer.js";

const songRoute = express.Router();

songRoute.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  addSong,
);

songRoute.get("/list", listSong);
songRoute.post("/remove", removeSong);
songRoute.post("/play", playSong);

// 🚀 અહી મેં 'songRouter' નું 'songRoute' કરી નાખ્યું છે!
songRoute.post("/update-order", updateSongOrder);

export default songRoute;
