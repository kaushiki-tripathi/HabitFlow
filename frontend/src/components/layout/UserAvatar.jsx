import { useEffect, useState } from "react";
import { getInitials } from "./navLinks";

export default function UserAvatar({
  name = "User",
  avatar = "",
  size = "md", // sm | md | lg
  className = "",
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [avatar]);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-sm",
    xl: "h-16 w-16 text-lg",
  };

  if (avatar && !imgError) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
        className={`inline-flex shrink-0 rounded-full object-cover border border-[#E8DFD6] ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#2C261F] font-serif font-semibold text-[#FFFCFA] ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}