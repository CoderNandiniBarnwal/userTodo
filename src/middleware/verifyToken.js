import jwt from "jsonwebtoken";
import userSchema from "../model/userSchema.js";

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: true,
        message: "Token authorization invalid or not found!",
      });
    } else {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        console.log("decoded", decoded);
        if (err) {
          if (err.message === "ExpiredTokenError") {
            return res.status(401).json({
              success: false,
              message: "Token expired!",
            });
          }
          return res.status(401).json({
            success: false,
            message: "Token invalid!",
          });
        } else {
          const { id } = decoded;
          const user = await userSchema.findById(id);
          if (!user) {
            return res.status(401).json({
              success: false,
              message: "User not found!",
            });
          } else {
            user.token = null;
            user.isVerified = true;
            await user.save();
            return res.status(200).json({
              success: true,
              message: "User verified successfully!",
            });
          }
        }
      });
    }
  } catch (e) {
    return res.status(500).jason({
      success: false,
      message: e.message,
    });
  }
};
