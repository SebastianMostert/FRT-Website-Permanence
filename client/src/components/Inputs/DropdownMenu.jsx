/* eslint-disable react/prop-types */
// DropdownMenu.js

import InputLabel from "./InputLabel";

const DropdownMenu = ({ selectedValue, onChange, options, label }) => {
  if (!selectedValue || !onChange || !options) return null

  return (
    <>
      <InputLabel text={label} />
      <select
        value={selectedValue}
        onChange={onChange}
        className='bg-slate-100 rounded-lg p-3'
        id='studentClass'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default DropdownMenu;