/* eslint-disable react/prop-types */
import moment from 'moment';
import '../../Styles/SlotLane.css';

const SlotLane = ({ arg }) => {
    const { time } = arg;
    const minutes = moment(time.milliseconds).format('mm');

    return (
        <div className={`slot-lane slot-lane-${minutes}`} />
    );
};

export default SlotLane;