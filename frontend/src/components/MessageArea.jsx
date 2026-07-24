import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { appendMessage } from "../redux/messageSlice";
import Avatar from "./Avatar";
import { isUserOnline, toId } from "../utils/online";

function MessageArea() {
  const { selectedUser, userData, socket, onlineUsers } = useSelector(
    (state) => state.user
  );
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [sending, setSending] = useState(false);
  const image = useRef();
  const bottomRef = useRef();

  const isOnline = selectedUser && isUserOnline(onlineUsers, selectedUser._id);

  const clearImage = () => {
    setFrontendImage(null);
    setBackendImage(null);
    if (image.current) image.current.value = "";
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !backendImage) || sending) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("message", input.trim());
      if (backendImage) formData.append("image", backendImage);
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(appendMessage(result.data));
      setInput("");
      clearImage();
      setShowPicker(false);
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send message";
      alert(errMsg);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const onNew = (mess) => {
      // Only append if it belongs to the open chat
      if (
        selectedUser &&
        (toId(mess.sender) === toId(selectedUser._id) ||
          toId(mess.receiver) === toId(selectedUser._id))
      ) {
        dispatch(appendMessage(mess));
      }
    };
    socket.on("newMessage", onNew);
    return () => socket.off("newMessage", onNew);
  }, [socket, selectedUser, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  if (!selectedUser) {
    return (
      <div className="hidden h-full flex-1 flex-col items-center justify-center bg-gradient-to-br from-ink-50 via-white to-brand-50 lg:flex">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-brand-600 shadow-soft">
          <HiOutlineChatBubbleLeftRight className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-800">
          Welcome to Chatly
        </h1>
        <p className="mt-2 max-w-sm text-center text-ink-500">
          Select a contact from the sidebar to start a friendly realtime chat.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full w-full flex-1 flex-col bg-[#eef6f9] ${
        selectedUser ? "flex" : "hidden lg:flex"
      }`}
    >
      {/* Chat header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-brand-100 bg-gradient-to-r from-brand-600 to-brand-500 px-3 py-3 shadow-soft sm:px-5">
        <button
          type="button"
          className="rounded-full p-1 text-white transition hover:bg-white/15 lg:hidden"
          onClick={() => dispatch(setSelectedUser(null))}
        >
          <IoIosArrowRoundBack className="h-8 w-8" />
        </button>
        <Avatar src={selectedUser?.image} size={46} online={isOnline} />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-white">
            {selectedUser?.name || selectedUser?.userName || "User"}
          </h1>
          <p className="text-xs font-medium text-brand-100">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-5">
        {(messages || []).length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-ink-500">
            <p className="text-sm font-medium">No messages yet</p>
            <p className="mt-1 text-xs">Say hello and start the conversation</p>
          </div>
        ) : (
          (messages || []).map((mess) =>
            toId(mess.sender) === toId(userData._id) ? (
              <SenderMessage
                key={mess._id}
                image={mess.image}
                message={mess.message}
                createdAt={mess.createdAt}
              />
            ) : (
              <ReceiverMessage
                key={mess._id}
                image={mess.image}
                message={mess.message}
                createdAt={mess.createdAt}
              />
            )
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="relative shrink-0 border-t border-ink-100 bg-white/80 px-3 py-3 backdrop-blur sm:px-5">
        {showPicker && (
          <div className="absolute bottom-[72px] left-3 z-30 overflow-hidden rounded-2xl shadow-card">
            <EmojiPicker
              width={280}
              height={360}
              onEmojiClick={(emojiData) => {
                setInput((prev) => prev + emojiData.emoji);
                setShowPicker(false);
              }}
            />
          </div>
        )}

        {frontendImage && (
          <div className="mb-2 flex items-start gap-2">
            <div className="relative">
              <img
                src={frontendImage}
                alt="Preview"
                className="h-20 w-20 rounded-xl object-cover shadow-card"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -right-2 -top-2 rounded-full bg-ink-800 p-1 text-white shadow"
              >
                <RxCross2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <form
          className="flex items-center gap-2 rounded-full bg-brand-600 px-3 py-2 shadow-soft sm:gap-3 sm:px-4"
          onSubmit={handleSendMessage}
        >
          <button
            type="button"
            onClick={() => setShowPicker((p) => !p)}
            className="shrink-0 text-white/90 transition hover:text-white"
            title="Emoji"
          >
            <RiEmojiStickerLine className="h-6 w-6" />
          </button>

          <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />

          <input
            type="text"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/70"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="button"
            onClick={() => image.current?.click()}
            className="shrink-0 text-white/90 transition hover:text-white"
            title="Attach image"
          >
            <FaImages className="h-5 w-5" />
          </button>

          {(input.trim().length > 0 || backendImage) && (
            <button
              type="submit"
              disabled={sending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow transition hover:scale-105 disabled:opacity-60"
              title="Send"
            >
              <RiSendPlane2Fill className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default MessageArea;
