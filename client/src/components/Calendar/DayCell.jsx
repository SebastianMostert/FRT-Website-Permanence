/* eslint-disable react/prop-types */

import '../../Styles/DayCell.css';
import { isMobile } from '../../utils';

const DayCell = ({ arg }) => {
    const date = arg.date;
    const day = date.getDate();
    const viewType = arg.view.type;
    const isYearView = viewType === 'multiMonthYear';

    return (
        <div className={(!isYearView && !isMobile()) ? 'custom-day-cell' : ''}>
            <div className="day">{day}</div>
        </div>
    );
};

export default DayCell;
