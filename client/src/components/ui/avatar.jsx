const Avatar = ({ src, alt = "Avatar", className }) => {
    return (
      <img
        src={src || "/avatar.png"}
        alt={alt}
        className={`w-24 h-24 rounded-full object-cover border-2 border-gray-300 ${className}`}
      />
    );
  };
  
  export default Avatar;
  