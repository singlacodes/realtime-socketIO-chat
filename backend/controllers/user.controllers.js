import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `current user error ${error}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};

    if (typeof name === "string" && name.trim()) {
      updateData.name = name.trim();
    }

    if (req.file) {
      const imageUrl = await uploadOnCloudinary(req.file.path);
      updateData.image = imageUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("editProfile error:", error?.message || error);
    return res.status(500).json({
      message: error?.message || `profile error ${error}`,
    });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `get other users error ${error}` });
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `search users error ${error}` });
  }
};
