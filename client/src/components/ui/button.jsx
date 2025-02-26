import { cn } from "@/lib/utils";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
