/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Tab, Tabs, Table, Button } from 'react-bootstrap';
import MarkBesetztModal from './MarkBesetztModal'; // Import the modal component
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';


const ShiftAvailability = () => {
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user)
    const IAM = currentUser.IAM;
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availabilty, setAvailability] = useState([]);
    const [shift, setShift] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const availabilities = await getAvailabilities(IAM);
            setAvailability(availabilities);

            const shifts = await getShifts();
            setShift(shifts);
        }

        fetchData();
    }, [IAM, currentUser, t]);

    const markBesetzt = (slot) => {
        setSelectedSlot(slot);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSlot(null);
    };

    //#region Shifts
    async function getShifts() {
        const res = await fetch(`/api/v1/shift/fetch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = (await res.json()).data;
        return data;
    }
    const deleteShift = async (id) => {
        console.log(id);
        // Implement the logic to delete the shift
        // You can make an API call to delete the shift
        const res = await fetch(`/api/v1/shifts/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(res);

        if (res.status !== 200) {
            toast.error('Failed to delete shift.');
            return;
        }

        if (res.status === 200) {
            // Refetch data after deletion
            const data = await getShifts();
            setShift(data);
            toast.success('Shift deleted successfully.');
        }
    };
    //#endregion

    //#region Availabilities
    async function getAvailabilities() {
        const res = await fetch(`/api/v1/availability/all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();

        return data;
    }
    const deleteAvailability = async (id, IAM) => {
        try {
            const res = await fetch(`/api/v1/availability/delete/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ IAM: IAM, id: id }),
            });

            const data = await res.json();

            if (data?.success !== true) {
                // Handle error, show alert, etc.
                return;
            }

            // Refetch data after deletion
            const availabilities = await getAvailabilities();
            setAvailability(availabilities);
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

    return (
        <div>
            <Tabs defaultActiveKey="availabilities" id="shiftTabs">
                <Tab eventKey="availabilities" title="All Availabilities">
                    <div className="mt-3">
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
                                {availabilty?.map((availability, index) => {
                                    const overlaps = availabilty?.some((otherAvailability) =>
                                        checkOverlap(
                                            new Date(availability?.startTime),
                                            new Date(availability?.endTime),
                                            new Date(otherAvailability?.startTime),
                                            new Date(otherAvailability?.endTime)
                                        )
                                    );

                                    const rowClassName = overlaps ? 'overlap-row' : (index % 2 === 0 ? 'even-row' : 'odd-row');

                                    return (
                                        <tr key={availability?._id} className={rowClassName}>
                                            <td>{availability?.IAM}</td>
                                            <td>{new Date(availability?.startTime).toLocaleDateString()}</td>
                                            <td>{new Date(availability?.startTime).toLocaleTimeString()}</td>
                                            <td>{new Date(availability?.endTime).toLocaleTimeString()}</td>
                                            <td>{availability?.confirmed ? 'Confirmed' : 'Not Confirmed'}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => deleteAvailability(availability?._id, availability?.IAM)}
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
                    </div>
                </Tab>
                <Tab eventKey="overlapping" title="Overlapping Time Slots">
                    <div className="mt-3">
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
                </Tab>
                <Tab eventKey="shifts" title="Shifts">
                    <div className="mt-3">
                        {!shift || shift.length === 0 ? (
                            <p>No shifts available.</p>
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>IAM</th>
                                        <th>Full Name</th>
                                        <th>Position</th>
                                        <th>Date</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Action</th> {/* New Action Column Header */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {shift.map((shift, index) => {
                                        const IAMs = [];
                                        const fullNames = [];
                                        const positions = [];

                                        const startDate = new Date(shift.shifts[0].startDate);
                                        const endDate = new Date(shift.shifts[0].endDate);

                                        const startDateStr = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;

                                        const startTimeStr = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
                                        const endTimeStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

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
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => deleteShift(shift._id)}
                                                    >
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
                </Tab>
            </Tabs>

            <MarkBesetztModal
                show={showModal}
                handleClose={handleCloseModal}
                selectedSlot={selectedSlot}
                availabilities={availabilty}
                setAvailabilities={setAvailability}
                shifts={shift}
            />
        </div>
    );
};

export default ShiftAvailability;
