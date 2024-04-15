import "./Input.scss";

function Input({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  inputClass,
  labelClass,
}) {
  return (
    <div className="field">
      <label htmlFor={name} className={`field__label ${labelClass}`}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Input;
