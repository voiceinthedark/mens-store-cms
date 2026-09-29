// filepath: packages/api/src/services/upload.service.ts

import multer from "multer";
import { randomUUID } from "crypto";
import { env } from "../config/env";
import { supabase } from "../utils/supabase";

// Memory storage keeps file buffer in RAM for streaming to Supabase Storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * Uploads a file buffer to Supabase Storage and returns its public URL.
 * Replaces the previous Cloudinary-based implementation (Cloudinary is
 * unavailable in some regions, e.g. Lebanon).
 *
 * @param fileBuffer - Raw image bytes from multer's memory storage.
 * @param mimeType - The file's MIME type (e.g. "image/png").
 * @param folder - Storage path prefix, e.g. "products".
 */
export const uploadToSupabase = async (
  fileBuffer: Buffer,
  mimeType: string,
  folder: string = "products",
): Promise<string> => {
  const extension = mimeType.split("/")[1] || "jpg";
  const path = `${folder}/${randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(path, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
};

/**
 * Deletes a file from Supabase Storage by its path.
 *
 * @param path - The storage path of the file to delete (e.g. "products/uuid.jpg").
 */
export const deleteFromSupabase = async (path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(`Supabase delete failed: ${error.message}`);
  }
};
