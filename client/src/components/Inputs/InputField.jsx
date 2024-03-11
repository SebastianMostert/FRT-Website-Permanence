import InputLabel from "./InputLabel";

/* eslint-disable react/prop-types */
const InputField = ({ id, type, placeholder, value, onChange, defaultValue, label, className }) => {
    return (
        <>
            {label && <InputLabel text={label} />}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className={`bg-slate-100 rounded-lg p-3 ${className}`}
                value={value}
                onChange={onChange}
                defaultValue={defaultValue}
            />
        </>
    );
};

export default InputField;