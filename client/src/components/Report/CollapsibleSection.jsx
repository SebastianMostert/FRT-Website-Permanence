// CollapsibleSection.jsx
import PropTypes from "prop-types";
import { useState } from "react";

const CollapsibleSection = ({ title, children }) => {
    const [isVisible, setIsVisible] = useState(true);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="border p-4 rounded-md shadow-md mb-8">
            {/* Collapsible header */}
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleVisibility}
            >
                <h2 className="text-xl font-semibold">{title}</h2>
                <span>{isVisible ? "▼" : "▲"}</span>
            </div>
            {/* Collapsible content */}
            {isVisible && <div className="mt-4">{children}</div>}
        </div>
    );
};

CollapsibleSection.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default CollapsibleSection;
