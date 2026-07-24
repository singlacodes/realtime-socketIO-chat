import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const message = req.body?.message || "";

    let image = "";
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    if (!message && !image) {
      return res.status(400).json({ message: "Message text or image is required" });
    }

    let conversation = await Conversation.findOne({
      partcipants: { $all: [sender, receiver] },
    });

    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        partcipants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage error:", error?.message || error);
    return res.status(500).json({
      message: error?.message || `send Message error ${error}`,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const conversation = await Conversation.findOne({
      partcipants: { $all: [sender, receiver] },
    }).populate("messages");

    return res.status(200).json(conversation?.messages || []);
  } catch (error) {
    return res.status(500).json({ message: `get Message error ${error}` });
  }
};
