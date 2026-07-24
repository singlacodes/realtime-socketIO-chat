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
        <span
          className="absolute bottom-0 right-0 z-10 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 shadow-md ring-1 ring-emerald-500/30"
          title="Online"
          aria-label="Online"
        />
      )}
    </div>
  );
}

export default Avatar;
