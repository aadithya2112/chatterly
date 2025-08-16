import express from "express";
import { createServer } from "http";
import cors from "cors";
import chatRouter from "./socket";

const app = express();
// Port configuration
const PORT = process.env.PORT || 4000;

// CORS for chat-widget
app.use(
  cors({
    origin: "*", // Allow all origins for development
    credentials: true,
  })
);

// TODO: Add HTTP endpoints for chat
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chatterly backend running.");
});

// Mount chat endpoints
app.use("/api", chatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
