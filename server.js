import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { swaggerUi, swaggerSpec } from "./config/swagger.js"; 
import indexRoutes from "./routes/index.js"
const app = express();
const PORT = process.env.PORT || 8080;
// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors());
// Main Router
app.use("/api", indexRoutes);
app.use("/test", (req, res) => {
  res.status(200).json({
    message: "It Works ❤️❤️👍",
    status: 200,
    authorizer: {
      name: "Hassan Ali Hassan",
      email: "hassanalihassan1203@gmail.com",
      github: "https://github.com/hassanali199912",
    },
  });
});
// swagger Integration 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// MongoDB Connection And Start Server

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running Swigger Doc  http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => console.log(err));
