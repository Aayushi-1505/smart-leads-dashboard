import dotenv from "dotenv";

dotenv.config();

export const env = {
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/smart-leads-dashboard",
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
};