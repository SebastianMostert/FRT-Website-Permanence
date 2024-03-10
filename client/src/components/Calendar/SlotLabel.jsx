/* eslint-disable react/prop-types */
import moment from 'moment';
import '../../Styles/SlotLabel.css';

const SlotLabel = ({ arg }) => {
    const { text } = arg;
    const formattedTime = moment(text, 'HH:mm').format('HH:mm');
    const formattedTime2 = moment(text, 'HH:mm').add(30, 'minutes').format('HH:mm');

    return (
        <div className="slot-label">
            <div className="time-text">{formattedTime} - {formattedTime2}</div>
        </div>
    );
};

export default SlotLabel;