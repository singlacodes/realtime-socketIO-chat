import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { mediaUrl } from "../utils/mediaUrl";
import { formatMessageTime } from "../utils/formatTime";
import Avatar from "./Avatar";

function ReceiverMessage({ image, message, createdAt }) {
  const scroll = useRef();
  const { selectedUser } = useSelector((state) => state.user);
  const imageSrc = mediaUrl(image);
  const hasImage = Boolean(imageSrc && String(imageSrc).trim());
  const hasMessage = Boolean(message && String(message).trim());

  useEffect(() => {
    scroll?.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  if (!hasImage && !hasMessage) return null;

  return (
    <div className="flex animate-fade-in items-end justify-start gap-2">
      <Avatar src={selectedUser?.image} size={34} />
      <div
        ref={scroll}
        className="max-w-[min(75%,28rem)] rounded-2xl rounded-bl-md border border-ink-100 bg-white px-3.5 py-2.5 text-ink-800 shadow-card"
      >
        {hasImage && (
          <img
            src={imageSrc}
            alt="Received"
            className="mb-1.5 max-h-56 w-full max-w-[220px] rounded-xl object-cover"
            onLoad={() =>
              scroll?.current?.scrollIntoView({ behavior: "smooth" })
            }
          />
        )}
        {hasMessage && (
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {message}
          </p>
        )}
        <p className="mt-1 text-[10px] font-medium text-ink-500">
          {formatMessageTime(createdAt)}
        </p>
      </div>
    </div>
  );
}

export default ReceiverMessage;
