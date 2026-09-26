// filepath: packages/api/src/app.ts

import { env } from "./config/env";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import uploadRoutes from "./routes/upload.routes";
import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import reviewRoutes from "./routes/review.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";

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
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Root route
app.get("/", (_, res) => {
  res.send("Welcome to the API");
});

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler for unmatched routes (must come after all routes)
app.use(notFoundHandler);

// Global error handler (must be registered last)
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
