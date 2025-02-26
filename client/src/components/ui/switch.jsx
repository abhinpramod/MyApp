const Switch = ({ checked, onChange }) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-primary transition-all"></div>
        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:left-6 transition-all"></div>
      </label>
    );
  };
  
  export default Switch;
  