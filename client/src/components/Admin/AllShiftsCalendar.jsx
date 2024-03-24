/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment);

const AllShiftsCalendar = ({ availabilty, deleteAvailability }) => {
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentView, setCurrentView] = useState('week');

    const handleDelete = () => {
        if (selectedAvailability) {
            deleteAvailability(selectedAvailability._id, selectedAvailability.IAM);
            setShowModal(false);
            setSelectedAvailability(null);
        }
    };

    const handleEventClick = (event) => {
        setSelectedAvailability(event);
        setShowModal(true);
    };

    const events = availabilty?.map((availability) => ({
        ...availability,
        title: availability.IAM,
        start: new Date(availability.startTime),
        end: new Date(availability.endTime),
    }));

    const CustomToolbar = (toolbar) => {
        const goToToday = () => {
            toolbar.onNavigate('TODAY');
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };

        const goToPrev = () => {
            toolbar.onNavigate('PREV');
        };

        const changeView = (view) => {
            toolbar.onView(view);
            setCurrentView(view);
        };

        return (
            <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                <div className="d-flex align-items-center">
                    <Button variant="primary" className="mr-2" onClick={() => goToPrev()}>
                        &lt; Prev
                    </Button>
                    <Button variant="primary" className="mr-2" onClick={() => goToToday()}>
                        Today
                    </Button>
                    <Button variant="primary" onClick={() => goToNext()}>
                        Next &gt;
                    </Button>
                </div>
                <div>
                    <h5>{toolbar.label}</h5>
                </div>
                <div>
                    <Button
                        variant={currentView === 'week' ? 'primary' : 'outline-primary'}
                        className="mr-2"
                        onClick={() => changeView('week')}
                    >
                        Week
                    </Button>
                    <Button
                        variant={currentView === 'day' ? 'primary' : 'outline-primary'}
                        onClick={() => changeView('day')}
                    >
                        Day
                    </Button>
                </div>
            </div>
        );
    };

    const Sidebar = () => (
        <div className="bg-light p-3" style={{ height: "calc(100vh - 20px)", width: "10vw", overflowY: "auto" }}>
            <h5>Availabilities</h5>
            <ListGroup>
                {availabilty?.map((availability) => (
                    <ListGroup.Item
                        key={availability._id}
                        action
                        className='mt-2 rounded-sm'
                        onClick={() => handleEventClick(availability)}
                    >
                        <Badge>{availability.IAM}</Badge>
                        <br />
                        {new Date(availability.startTime).toLocaleDateString()}
                        <br />
                        {moment(availability.startTime).format('HH:mm')} - {moment(availability.endTime).format('HH:mm')}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView='week'
                    style={{ height: "calc(100vh - 20px)", width: "70vw", margin: "0 auto" }}
                    defaultDate={moment().toDate()}
                    onSelectEvent={handleEventClick}
                    min={new Date(moment().set('hour', 8).set('minute', 0).set('second', 0))}
                    max={new Date(moment().set('hour', 18).set('minute', 0).set('second', 0))}
                    formats={{
                        timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture)
                    }}
                    timeslots={1} // Display one hour per row
                    components={{
                        toolbar: CustomToolbar
                    }}
                    views={['week']}
                    onView={(view) => setCurrentView(view)}
                    // Hide Saturday and Sunday
                    length={5}
                    showMultiDayTimes={false}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Availability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this availability ({selectedAvailability?.IAM})?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllShiftsCalendar;
