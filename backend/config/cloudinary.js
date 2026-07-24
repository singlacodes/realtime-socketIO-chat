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

/**
 * Prefer Cloudinary. If the API key cannot create assets (403 missing permissions),
 * fall back to a local public URL so profile/chat images still work in dev.
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
  const baseUrl = (
    process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8000}`
  ).replace(/\/$/, "");

  const toLocalUrl = () => {
    const fileName = path.basename(filePath);
    // File already lives under ./public from multer
    return `${baseUrl}/public/${fileName}`;
  };

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      "Cloudinary env missing — serving image from local /public instead"
    );
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

    // Keep the local file and return a local URL so the app still works.
    // Typical case: API key missing "create" permission.
    if (
      httpCode === 403 ||
      /missing permissions|forbidden|unauthorized|invalid/i.test(message)
    ) {
      console.warn(
        "Falling back to local image URL. Fix Cloudinary API key create permission to use Cloudinary."
      );
      return toLocalUrl();
    }

    // Other errors: still fall back in dev so chat/profile images work
    console.warn("Falling back to local image URL after Cloudinary failure.");
    return toLocalUrl();
  }
};

export default uploadOnCloudinary;
