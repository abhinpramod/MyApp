const Card = ({ children, className, onClick }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl p-4 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
