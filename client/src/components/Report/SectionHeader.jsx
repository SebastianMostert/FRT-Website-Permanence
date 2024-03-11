// SectionHeader.js
import PropTypes from "prop-types";

const SectionHeader = ({ text }) => (
    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
        {text}
    </h2>
);

SectionHeader.propTypes = {
    text: PropTypes.string.isRequired,
};

export default SectionHeader;
