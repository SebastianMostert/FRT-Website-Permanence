/* eslint-disable react/prop-types */
// MultiSelectDropdown.js
import Select from 'react-select';
import InputLabel from "./InputLabel";

const MultiSelectDropdown = ({ selectedValues, onChange, options, id, label }) => {
    // Check if the selectedValues are in the form of an array containing objects
    let _value = selectedValues

    if (Array.isArray(selectedValues)) {
        if (Array.isArray(selectedValues) && selectedValues.length > 0 && typeof selectedValues[0] === 'object') {
            _value = selectedValues
        } else {
            for (let i = 0; i < selectedValues.length; i++) {
                _value[i] = { value: selectedValues[i], label: selectedValues[i] }
            }
        }
    } else {
        _value = []
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
