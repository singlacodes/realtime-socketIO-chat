import dp from "../assets/dp.webp";
import { mediaUrl } from "../utils/mediaUrl";

function Avatar({ src, size = 48, online = false, className = "", alt = "avatar" }) {
  const dim = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={`avatar-ring ${className}`}
      style={{ width: dim, height: dim }}
    >
      <img
        src={mediaUrl(src) || dp}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = dp;
        }}
      />
      {online && (
        <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow" />
      )}
    </div>
  );
}

export default Avatar;
