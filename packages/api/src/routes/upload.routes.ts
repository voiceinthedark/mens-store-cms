import { Router, Response } from "express";
import { upload, uploadToCloudinary } from "../services/upload.service";
import {
  authenticate,
  authorize,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "STAFF"]),
  upload.array("images", 5), // Up to 5 product images
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No images provided" });
      }

      const uploadPromises = files.map((file) =>
        uploadToCloudinary(file.buffer, "mens-clothing"),
      );
      const imageUrls = await Promise.all(uploadPromises);

      res.status(200).json({ urls: imageUrls });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Image upload failed" });
    }
  },
);

export default router;
