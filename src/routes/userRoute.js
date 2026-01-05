import express from "express";
import { register } from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/verify", verifyToken);

export default userRoute;
