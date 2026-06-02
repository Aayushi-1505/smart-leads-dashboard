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

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });

export default app;