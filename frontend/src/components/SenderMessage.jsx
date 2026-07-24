import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { mediaUrl } from "../utils/mediaUrl";
import { formatMessageTime } from "../utils/formatTime";
import Avatar from "./Avatar";

function SenderMessage({ image, message, createdAt }) {
  const scroll = useRef();
  const { userData } = useSelector((state) => state.user);
  const imageSrc = mediaUrl(image);
  const hasImage = Boolean(imageSrc && String(imageSrc).trim());
  const hasMessage = Boolean(message && String(message).trim());

  useEffect(() => {
    scroll?.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  if (!hasImage && !hasMessage) return null;

  return (
    <div className="flex animate-fade-in items-end justify-end gap-2">
      <div
        ref={scroll}
        className="max-w-[min(75%,28rem)] rounded-2xl rounded-br-md bg-gradient-to-br from-brand-500 to-brand-600 px-3.5 py-2.5 text-white shadow-soft"
      >
        {hasImage && (
          <img
            src={imageSrc}
            alt="Sent"
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
        <p className="mt-1 text-right text-[10px] font-medium text-brand-100">
          {formatMessageTime(createdAt)}
        </p>
      </div>
      <Avatar src={userData?.image} size={34} />
    </div>
  );
}

export default SenderMessage;
