import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const safeUnlink = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.log("Failed to remove temp file:", err?.message || err);
  }
};

const isProduction = () =>
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

/**
 * Prefer Cloudinary secure_url.
 * Local /public fallback is only for development (or when SERVER_URL is a public HTTPS host).
 * Never return http://localhost URLs in production — browsers block them from Render.
 */
const uploadOnCloudinary = async (filePath) => {
  if (!filePath) {
    throw new Error("No file path provided for upload");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Upload file not found: ${filePath}`);
  }

  const cloudName = process.env.CLOUD_NAME?.trim();
  const apiKey = process.env.API_KEY?.trim();
  const apiSecret = process.env.API_SECRET?.trim();

  // Public backend host for image URLs (never localhost on Render)
  const publicBase = (
    process.env.SERVER_URL ||
    (isProduction() ? "https://realtime-socketio-chat.onrender.com" : "")
  ).replace(/\/$/, "");
  const fileName = path.basename(filePath);

  const toLocalUrl = () => {
    if (publicBase && !/localhost|127\.0\.0\.1/i.test(publicBase)) {
      return `${publicBase}/public/${fileName}`;
    }
    if (isProduction()) {
      // Last resort: absolute path on known backend host
      return `https://realtime-socketio-chat.onrender.com/public/${fileName}`;
    }
    const port = process.env.PORT || 8000;
    return `http://localhost:${port}/public/${fileName}`;
  };

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary env missing — using local/public URL fallback");
    if (isProduction() && !publicBase) {
      console.warn(
        "Set SERVER_URL to your public backend URL, or fix Cloudinary create permissions."
      );
    }
    return toLocalUrl();
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "chatly",
    });

    safeUnlink(filePath);

    if (!uploadResult?.secure_url) {
      throw new Error("Cloudinary upload succeeded but no secure_url returned");
    }

    console.log("Cloudinary upload OK:", uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (error) {
    const message =
      error?.error?.message ||
      error?.message ||
      "Cloudinary upload failed";
    const httpCode = error?.http_code || error?.error?.http_code;

    console.error("Cloudinary upload error:", message, httpCode || "");

    // Keep file for static serving and return a non-localhost URL when possible
    console.warn(
      "Falling back to local /public URL. Fix Cloudinary API key CREATE permission for permanent CDN images."
    );
    return toLocalUrl();
  }
};

export default uploadOnCloudinary;
