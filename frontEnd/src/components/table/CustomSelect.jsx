import React, { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";
import arrow from "../../assets/arrow_forward_ios.png";

const CustomSelect = ({ options, onChange, value, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select-container" ref={selectRef}>
      <div className="custom-select-header" onClick={() => setIsOpen(!isOpen)}>
        <div>{value || placeholder}</div>
        <div>
          <img src={arrow} alt="dropdown arrow" className="select-arrow" />
        </div>
      </div>
      {isOpen && (
        <ul className="custom-select-list">
          {options.map((option, index) => (
            <li
              key={index}
              className={`custom-select-option ${option.label === "All Protocols" ? "all-protocols" : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
