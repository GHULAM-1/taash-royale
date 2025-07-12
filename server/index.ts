import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user-routes";
import cors from "cors";
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.use(
  cors({
    origin: ["http://localhost:8081", "http://192.168.0.103:8081"],
    credentials: true,
  })
);
app.use(express.json());

const MONGODB_URI: string = process.env.MONGODB_URI as string;

mongoose
  .connect(MONGODB_URI, { dbName: "taash-royale-db" })
  .then(() => console.log("Connected to MongoDB - taash-royale-db"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
