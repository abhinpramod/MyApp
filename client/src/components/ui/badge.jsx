export const Badge = ({ children, variant = 'default' }) => {
    const variants = {
      default: 'bg-gray-200 text-gray-800',
      secondary: 'bg-blue-200 text-blue-800',
    };
  
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${variants[variant]}`}>
        {children}
      </span>
    );
  };