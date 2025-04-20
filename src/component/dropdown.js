// DropdownSearch.js

import React, { useEffect, useState } from "react";

const DropdownSearch = ({ options, change, value, name, isSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSet, setIsSet] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    typeof value === "object" ? value : null
  );

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (typeof value === "object" && value !== null) {
      setSelectedOption(value);
      setIsSet(true);
    }
  }, [selectedOption]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    change(option);
    setShowOptions(false);
  };

  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div
        className="  rounded-xl p-2 font-normal cursor-pointer text-sm z-0"
        onClick={() => setShowOptions(!showOptions)}
      >
        {selectedOption ? selectedOption.text : `Pilih ${name}..`}
      </div>
      {showOptions && (
        <div className="absolute w-full bg-blue-600 border border-blue-500 rounded-bl-xl rounded-br-xl mt-1 z-[99999] p-2 shadow-2xl">
          {isSearch && (
            <>
              <input
                type="text"
                className="w-full p-2 border bg-white border-slate-500 mb-4 rounded-lg text-slate-950 "
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </>
          )}
          <ul className="max-h-60 overflow-y-auto z-[9999]">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className="p-2  cursor-pointer  text-sm font-medium text-white hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.text}
                </li>
              ))
            ) : (
              <li className="p-2 text-slate-200">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;
