// filepath: packages/api/src/app.ts

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3020",
      "http://localhost:3021",
      "http://localhost:5000",
    ],
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Root route
app.get("/", (_, res) => {
  res.send("Welcome to the API");
});

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
