/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import MarkBesetztModal from './MarkBesetztModal'; // Import the modal component

const ShiftAvailability = ({ availabilities }) => {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleMarkBesetzt = () => {
        if (selectedTimes.length < 2) {
            alert('Please select at least two availabilities to mark as "Besetzt"');
            return;
        }

        // Perform your action here, such as marking the selected times as "Besetzt"
        console.log('Marking times as "Besetzt":', selectedTimes);
    };

    const deleteAvailability = (id) => {
        // Call your delete function with the id
        console.log('Deleting availability with ID:', id);
    };

    const markBesetzt = (slot) => {
        setSelectedSlot(slot);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSlot(null);
    };

    const checkOverlap = (time1Start, time1End, time2Start, time2End) => {
        return time1Start < time2End && time1End > time2Start;
    };

    const overlappingTimeSlots = [];
    availabilities.forEach((availability1, index) => {
        availabilities.slice(index + 1).forEach((availability2) => {
            if (
                checkOverlap(
                    new Date(availability1.startTime),
                    new Date(availability1.endTime),
                    new Date(availability2.startTime),
                    new Date(availability2.endTime)
                )
            ) {
                const startTime = new Date(
                    Math.max(new Date(availability1.startTime), new Date(availability2.startTime))
                );
                const endTime = new Date(
                    Math.min(new Date(availability1.endTime), new Date(availability2.endTime))
                );

                overlappingTimeSlots.push({
                    IAM: [availability1.IAM, availability2.IAM].join(', '),
                    date: startTime.toLocaleDateString(),
                    startTime: startTime.toLocaleTimeString(),
                    endTime: endTime.toLocaleTimeString(),
                    status: availability1.confirmed && availability2.confirmed ? 'Confirmed' : 'Not Confirmed',
                    availabilityIds: [`${availability1?.IAM}: ${availability1?._id}`, `${availability2?.IAM}: ${availability2?._id}`].join(', '),
                });
            }
        });
    });

    return (
        <div>
            <h3>Availabilities:</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>IAM</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {availabilities.map((availability, index) => {
                        const overlaps = availabilities.some((otherAvailability) =>
                            checkOverlap(
                                new Date(availability.startTime),
                                new Date(availability.endTime),
                                new Date(otherAvailability.startTime),
                                new Date(otherAvailability.endTime)
                            )
                        );

                        const rowClassName = overlaps ? 'overlap-row' : (index % 2 === 0 ? 'even-row' : 'odd-row');

                        return (
                            <tr key={availability._id} className={rowClassName}>
                                <td>{availability.IAM}</td>
                                <td>{new Date(availability.startTime).toLocaleDateString()}</td>
                                <td>{new Date(availability.startTime).toLocaleTimeString()}</td>
                                <td>{new Date(availability.endTime).toLocaleTimeString()}</td>
                                <td>{availability.confirmed ? 'Confirmed' : 'Not Confirmed'}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => deleteAvailability(availability._id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {overlappingTimeSlots.length > 0 && (
                <div>
                    <h3>Overlapping Time Slots:</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>IAM</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Status</th>
                                <th>Availabilities IDs</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overlappingTimeSlots.map((slot, index) => (
                                <tr key={index} className="overlap-row">
                                    <td>{slot.IAM}</td>
                                    <td>{slot.date}</td>
                                    <td>{slot.startTime}</td>
                                    <td>{slot.endTime}</td>
                                    <td>{slot.status}</td>
                                    <td>{slot.availabilityIds}</td>
                                    <td>
                                        <Button
                                            variant="success"
                                            onClick={() => markBesetzt(slot)}
                                        >
                                            Mark as &ldquo;Besetzt&ldquo;
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <MarkBesetztModal
                show={showModal}
                handleClose={handleCloseModal}
                selectedSlot={selectedSlot}
                availabilities={availabilities}
            />
        </div>
    );
};

export default ShiftAvailability;
