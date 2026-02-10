import React, { useState, useRef, useEffect } from "react";

const AutoCompleteInput = ({ 
  data = [], 
  placeholder = "", 
  value: controlledValue,
  onChange,
  className = "",
  style = {}
}) => {
  const [internalValue, setInternalValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSuggestions = (input) => {
    if (!input || !input.trim()) return [];
    
    const trimmedInput = input.trim().toLowerCase();
    
    return data
      .filter(item => item.toLowerCase().includes(trimmedInput))
      .slice(0, 10);
  };

  const handleInput = (e) => {
    const text = e.target.value;
    
    if (controlledValue === undefined) {
      setInternalValue(text);
    }
    
    const newSuggestions = getSuggestions(text);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
    setSelectedIndex(-1);
    
    onChange?.(text);
  };

  const selectItem = (item) => {
    if (controlledValue === undefined) {
      setInternalValue(item);
    }
    
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    onChange?.(item);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectItem(suggestions[selectedIndex]);
        }
        break;
      
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      
      default:
        break;
    }
  };

  const handleFocus = () => {
    if (value && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
        style={{
          borderColor: "#2DD4BF",
          backgroundColor: "#F0FDFA",
          ...style
        }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul 
          className="absolute z-50 w-full bg-white border-2 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
          style={{ borderColor: "#2DD4BF" }}
        >
          {suggestions.map((item, index) => (
            <li
              key={item}
              onClick={() => selectItem(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              className="px-4 py-2 cursor-pointer transition-colors"
              style={{
                backgroundColor: selectedIndex === index ? "#F0FDFA" : "white",
                color: "#134E4A"
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;