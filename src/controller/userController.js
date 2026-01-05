import userSchema from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
import { verifyEmail } from "../emailVerify/verifyMail.js";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existing = await userSchema.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const data = await userSchema.create({
      userName,
      email,
      password: hashPassword,
    });
    const token = jwt.sign({ id: data._id }, process.env.secretKey, {
      expiresIn: "5m",
    });

    verifyEmail(token, email);
    data.token = token;
    await data.save();

    return res.status(201).json({
      success: true,
      message: "User registered Sucessfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
