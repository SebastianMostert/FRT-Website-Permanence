// SectionSubHeader.js
import PropTypes from "prop-types";

const SectionSubHeader = ({ text }) => (
    <h3 className="text-lg font-semibold mb-3 text-gray-600">
        {text}
    </h3>
);

SectionSubHeader.propTypes = {
    text: PropTypes.string.isRequired,
};

export default SectionSubHeader;
