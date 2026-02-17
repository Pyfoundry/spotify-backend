import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

// 🚀 આ બે રસ્તાઓ (API) આપણે ફ્રન્ટએન્ડ માટે બનાવ્યા
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
