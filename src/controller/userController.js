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
    const user = await userSchema.create({
      userName,
      email,
      password: hashPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "5m",
    });

    verifyEmail(token, email);

    user.token = token;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered Sucessfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "unauthorized access",
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({
        success: false,
        message: "Invalid credintials",
      });
    }

    if (passwordCheck && user.isVerified === true) {
      const accessToken = jwt.sign({ id: user._id }, process.env.secretKey, {
        expiresIn: "10days",
      });
      const refreshToken = jwt.sign({ id: user._id }, process.env.secretKey, {
        expiresIn: "30days",
      });

      user.isLogin = true;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: accessToken,
        refreshToken: refreshToken,
        data: user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "complete vefication first then login",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
