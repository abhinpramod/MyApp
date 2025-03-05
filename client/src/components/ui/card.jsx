// import { on } from "events";

const Card = ({ children, className, onclick }) => {
    return (
      <div className={`bg-white shadow-lg rounded-xl p-4 ${className}`} onClick={onclick}>
        {children}
      </div>
    );
  };
  
  export default Card;
  