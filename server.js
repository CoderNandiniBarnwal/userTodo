import express from "express";
import { dbConnect } from "./src/config/dbConnect.js";
import dotenv from "dotenv/config";
import userRoute from "./src/routes/userRoute.js";

const app = express();

const port = process.env.PORT || 8002;

app.use(express.json());
app.use("/user", userRoute);

dbConnect();

app.listen(port, () => {
  console.log(`Port running at server ${port}`);
});
