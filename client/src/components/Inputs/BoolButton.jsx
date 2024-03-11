// eslint-disable react/prop-types
import PropTypes from "prop-types";
import { useState } from "react";

const BoolButton = ({ label, onChange, id }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        const newValue = !isSelected;
        setIsSelected(newValue);
        onChange({
            target: {
                id,
                value: newValue
            }
        });
    };

    return (
        <div className="flex items-center">
            <span className="mr-2">{label}</span>
            <button
                className={`cursor-pointer ${isSelected ? "bg-green-500" : "bg-gray-300"
                    } text-white w-6 h-6 rounded-full flex items-center justify-center focus:outline-none transition-all`}
                onClick={handleClick}
                id={id}
            >
                {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
            </button>
        </div>
    );
};

BoolButton.propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default BoolButton;
