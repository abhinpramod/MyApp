const Switch = ({ checked, onCheckedChange }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)} // Pass the new value
      />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;