import cors from "cors";
import express from "express";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";

const app = express();

app.use(cors({ credentials: true, origin: env.clientUrl }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "Smart Leads API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use(notFound);
app.use(errorHandler);

// Start listening immediately so the port is open and Render deployment detects it
app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

// Connect to MongoDB in the background
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    // Do not call process.exit(1) to allow the server to remain online
    // and respond to health checks, making debugging and deployment easier.
  });

export default app;