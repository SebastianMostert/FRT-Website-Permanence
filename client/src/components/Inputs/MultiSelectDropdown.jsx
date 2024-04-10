/* eslint-disable react/prop-types */
// MultiSelectDropdown.js
import Select from 'react-select';
import InputLabel from "./InputLabel";

const MultiSelectDropdown = ({ selectedValues, onChange, options, id, label }) => {
    // Create a new variable to hold the modified values
    let _value;

    if (Array.isArray(selectedValues)) {
        if (selectedValues.length > 0 && typeof selectedValues[0] === 'object') {
            _value = selectedValues;
        } else {
            // Map selectedValues to an array of objects
            _value = selectedValues.map(value => ({ value, label: value }));
        }
    } else {
        _value = [];
    }

    return (
        <>
            <InputLabel text={label} />
            <Select
                id={id}
                isMulti
                value={_value}
                onChange={onChange}
                options={options}
                className='bg-slate-100 rounded-lg p-3'
            />
        </>
    );
};

export default MultiSelectDropdown;
