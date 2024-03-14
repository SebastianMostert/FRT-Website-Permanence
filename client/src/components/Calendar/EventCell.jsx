/* eslint-disable react/prop-types */

const EventCell = ({ arg }) => {
    const { event } = arg;
    const { allDay, title, start, end } = event;

    // Function to format date and time
    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-GB", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
        });
    };

    return (
        <div
            className="relative event-cell"
        >
            <div className="event-title">{title}</div>
            {!allDay && (
                <div className="event-time">
                    {formatDate(start)} - {formatDate(end)}
                </div>
            )}
        </div >
    );
};

export default EventCell;
