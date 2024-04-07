/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Table, Button, Placeholder, Card } from 'react-bootstrap';
import MarkBesetztModal from './MarkBesetztModal'; // Import the modal component
import { toast } from 'react-toastify';
import AllShiftsCalendar from './Admin/AllShiftsCalendar';
import { apiDeleteAvailability, apiDeleteShift, useFetchAvailabilities, useFetchShifts } from '../APICalls/apiCalls';

const ShiftAvailability = ({ selectedTable }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const { data: availabilty, error: availabilityError } = useFetchAvailabilities();
    const { data: shift, error: shiftError } = useFetchShifts();

    if (availabilityError) {
        toast.error('An error occurred while fetching availabilities: ' + availabilityError.message);
    }

    if (shiftError) {
        toast.error('An error occurred while fetching shifts: ' + shiftError.message);
    }

    const markBesetzt = (slot) => {
        setSelectedSlot(slot);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSlot(null);
    };

    //#region Shifts
    const deleteShift = async (id) => {
        // Implement the logic to delete the shift
        // You can make an API call to delete the shift
        const res = await apiDeleteShift(id);

        if (res.status !== 200) {
            toast.error('Failed to delete shift.');
            return;
        }
    };
    //#endregion

    //#region Availabilities
    const deleteAvailability = async (id, IAM) => {
        try {
            const data = await apiDeleteAvailability(IAM, id);

            if (data?.success !== true) {
                // Handle error, show alert, etc.
                return;
            }
        } catch (err) {
            // Handle error, show alert, etc.
            console.error(err);
        }
    };
    const checkOverlap = (time1Start, time1End, time2Start, time2End) => {
        return time1Start < time2End && time1End > time2Start;
    };
    //#endregion

    const overlappingTimeSlots = [];
    availabilty?.forEach((availability1, index) => {
        availabilty?.slice(index + 1).forEach((availability2) => {
            if (
                checkOverlap(
                    new Date(availability1?.startTime),
                    new Date(availability1?.endTime),
                    new Date(availability2?.startTime),
                    new Date(availability2?.endTime)
                )
            ) {
                const startTime = new Date(
                    Math.max(new Date(availability1?.startTime), new Date(availability2?.startTime))
                );
                const endTime = new Date(
                    Math.min(new Date(availability1?.endTime), new Date(availability2?.endTime))
                );

                overlappingTimeSlots.push({
                    IAM: [availability1?.IAM, availability2?.IAM].join(', '),
                    date: startTime.toLocaleDateString(),
                    startTime: startTime.toLocaleTimeString(),
                    endTime: endTime.toLocaleTimeString(),
                    status: availability1?.confirmed && availability2?.confirmed ? 'Confirmed' : 'Not Confirmed',
                    availabilityIds: [
                        `${availability1?.IAM}: ${availability1?._id}`,
                        `${availability2?.IAM}: ${availability2?._id}`,
                    ].join(', '),
                });
            }
        });
    });

    const allShiftsTable = <AllShiftsCalendar availabilty={availabilty} deleteAvailability={deleteAvailability} />

    const overlappingTimeSlotsTable = (
        <div className="mt-3">
            <Table striped bordered hover responsive>
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
                                <Button variant="success" onClick={() => markBesetzt(slot)}>
                                    Mark as &ldquo;Besetzt&ldquo;
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );

    const shiftsTable = (
        <div className="mt-3">
            {!shift || shift.length === 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>IAM</th>
                            <th>Full Name</th>
                            <th>Position</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Placeholder as={Card.Text} animation="wave">
                                    <Placeholder as={Card.Text} xs={10} bg="secondary" />
                                </Placeholder>
                            </td>
                            <td>
                                <Placeholder as={Card.Text} animation="wave">
                                    <Placeholder as={Card.Text} xs={10} bg="secondary" />
                                </Placeholder>
                            </td>
                            <td>
                                <Placeholder as={Card.Text} animation="wave">
                                    <Placeholder as={Card.Text} xs={10} bg="secondary" />
                                </Placeholder>
                            </td>
                            <td>
                                <Placeholder as={Card.Text} animation="wave">
                                    <Placeholder as={Card.Text} xs={10} bg="secondary" />
                                </Placeholder>
                            </td>
                            <td>
                                <Placeholder as={Card.Text} animation="wave">
                                    <Placeholder as={Card.Text} xs={10} bg="secondary" />
                                </Placeholder>
                            </td>
                            <td>
                                <Placeholder as={Card.Text} animation="wave">
                                    <Placeholder as={Card.Text} xs={10} bg="secondary" />
                                </Placeholder>
                            </td>
                            <td>
                                <Placeholder.Button variant="danger" animation="wave">
                                    Delete
                                </Placeholder.Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>IAM</th>
                            <th>Full Name</th>
                            <th>Position</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shift.map((shift, index) => {
                            const IAMs = [];
                            const fullNames = [];
                            const positions = [];

                            const startDate = new Date(shift.shifts[0].startDate);
                            const endDate = new Date(shift.shifts[0].endDate);

                            const startDateStr = `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
                                .toString()
                                .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;

                            const startTimeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate
                                .getMinutes()
                                .toString()
                                .padStart(2, '0')}`;
                            const endTimeStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
                                .getMinutes()
                                .toString()
                                .padStart(2, '0')}`;

                            for (let i = 0; i < shift.shifts.length; i++) {
                                const shiftEl = shift.shifts[i];
                                IAMs.push(shiftEl.IAM);
                                fullNames.push(shiftEl.firstName + ' ' + shiftEl.lastName);
                                positions.push(shiftEl.position);
                            }

                            return (
                                <tr key={index}>
                                    <td>{IAMs.join(', ')}</td>
                                    <td>{fullNames.join(', ')}</td>
                                    <td>{positions.join(', ')}</td>
                                    <td>{startDateStr}</td>
                                    <td>{startTimeStr}</td>
                                    <td>{endTimeStr}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deleteShift(shift._id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    );

    return (
        <div>
            {selectedTable === 'availabilities' && allShiftsTable}
            {selectedTable === 'overlapping' && overlappingTimeSlotsTable}
            {selectedTable === 'shifts' && shiftsTable}

            <MarkBesetztModal
                show={showModal}
                handleClose={handleCloseModal}
                availabilities={availabilty}
                shifts={shift}
                IAMList={selectedSlot?.IAM.split(', ')}
                availabilityIdsList={selectedSlot?.availabilityIds.split(', ')}
                date={selectedSlot?.date}
                startTime={selectedSlot?.startTime}
                endTime={selectedSlot?.endTime}
            />
        </div>
    );
};

export default ShiftAvailability;
