/* eslint-disable react/prop-types */

import '../../Styles/DayHeader.css';

const DayHeader = ({ arg }) => {
    const { text } = arg;

    return (
        <div>
            {text}
        </div>
    );
};

export default DayHeader;
