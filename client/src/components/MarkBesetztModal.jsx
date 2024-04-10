/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getMember } from '../utils';

const MarkBesetztModal = ({ show, handleClose, shifts, IAMList, availabilityIdsList, date, startTime, endTime }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            // Split date into day, month, and year
            const [day, month, year] = date.split('/');

            // Split startTime and endTime into hours and minutes
            const [startHour, startMinute] = startTime.split(':');
            const [endHour, endMinute] = endTime.split(':');

            // Create startDate and endDate
            const startDate = new Date(year, month - 1, day, startHour, startMinute);
            const endDate = new Date(year, month - 1, day, endHour, endMinute);

            const users = await Promise.all(
                IAMList.map(async (iam, index) => {
                    const res = await getMember(iam);
                    if (res.success) {
                        const availabilityId = availabilityIdsList[index].trim().replace(`${iam}: `, '');

                        return {
                            IAM: res.data.IAM,
                            firstName: res.data.firstName || 'Unknown',
                            lastName: res.data.lastName || 'User',
                            position: '',
                            selected: true, // Initially all users are selected
                            availabilityId: availabilityId, // Add availability ID
                            operationalPosition: res.data.operationalPosition,
                            startDate,
                            endDate
                        };
                    }
                    return null;
                })
            );

            setSelectedUsers(users.filter((user) => user !== null));
            setLoading(false);
        };

        fetchUsers();
    }, [IAMList, availabilityIdsList, date, endTime, startTime]);

    const handleSelectPosition = (event, userIAM) => {
        const { value } = event.target;

        setSelectedUsers((prevUsers) =>
            prevUsers.map((user) => (user.IAM === userIAM ? { ...user, position: value } : user))
        );
    };

    const handleRemoveUser = (userIAM) => {
        setSelectedUsers((prevUsers) => prevUsers.filter((user) => user.IAM !== userIAM));
    };

    const handleCreateShift = async () => {
        const selectedUsersWithPosition = selectedUsers.filter((user) => user.position !== '');

        if (selectedUsersWithPosition.length === 0) {
            alert('Please select positions for at least one user.');
            return;
        }

        const chefsCount = selectedUsersWithPosition.filter(user => user.position === 'Chef Agres').length;
        const equipiersCount = selectedUsersWithPosition.filter(user => user.position === 'Equipier Bin.').length;
        const stagiairesCount = selectedUsersWithPosition.filter(user => user.position === 'Stagiaire Bin.').length;

        const valid = validateShift(chefsCount, equipiersCount, stagiairesCount);

        console.log(valid);
        if (!valid.isValid) {
            alert(valid.message);
            return;
        }

        for (let i = 0; i < selectedUsersWithPosition.length; i++) {
            const selectedUserWithPosition = selectedUsersWithPosition[i];
            // only delete availability if the start time and end time exactly match the created shifts start and end time
            const shiftStart = new Date(selectedUserWithPosition.startDate);
            const shiftEnd = new Date(selectedUserWithPosition.endDate);

            const availabilityID = selectedUserWithPosition.availabilityId;
            const IAM = selectedUserWithPosition.IAM;

            // Fetch availability
            const availability = await getAvailabilities(availabilityID);
            const availabilityStart = new Date(availability.startTime);
            const availabilityEnd = new Date(availability.endTime);

            if (shiftStart.getTime() === availabilityStart.getTime() && shiftEnd.getTime() === availabilityEnd.getTime()) {
                deleteAvailability(availabilityID, IAM);
            } else {
                // Delete availability
                deleteAvailability(availabilityID, IAM);

                // Validate start and end time are not the same
                if (shiftStart.getTime() === shiftEnd.getTime()) {
                    console.error('Start and end time cannot be the same.');
                    continue; // Skip this user and move to the next
                }

                // Create new availabilities
                const newAvailability1 = {
                    IAM,
                    startTime: availabilityStart,
                    endTime: shiftStart,
                };

                const newAvailability2 = {
                    IAM,
                    startTime: shiftEnd,
                    endTime: availabilityEnd,
                };

                // Implement logic to create new availabilities, possibly with an API call
                if (availabilityStart.getTime() === shiftStart.getTime()) {

                    return;
                }
                // Implement logic to create new availabilities, possibly with an API call
                if (shiftEnd.getTime() === availabilityEnd.getTime()) {

                    return;
                }

                createAvailability(newAvailability1);
                createAvailability(newAvailability2);
            }
        }

        createShiftDB(selectedUsersWithPosition);
        handleClose();
    };

    const validateShift = (chefsCount, equipiersCount, stagiairesCount) => {
        console.log(chefsCount, equipiersCount, stagiairesCount);
        if (chefsCount + equipiersCount + stagiairesCount < 2 || chefsCount + equipiersCount + stagiairesCount > 3) return { isValid: false, message: 'Each shift must have at least 2 and at most 3 positions.' };
        if (chefsCount === 1 && equipiersCount === 1 && stagiairesCount === 1) return { isValid: true, message: '' };
        if (chefsCount === 1 && equipiersCount === 1 && stagiairesCount === 0) return { isValid: true, message: '' };

        // Ensure that there is no other shift
        for (let i = 0; i < shifts.length; i++) {
            const shift = shifts[i];
            const shiftStart = new Date(shift.startDate);
            const shiftEnd = new Date(shift.endDate);
            if (shiftStart >= shiftEnd) continue;
            if (shiftStart <= shiftStart && shiftEnd >= shiftEnd) return { isValid: false, message: 'You cannot have multiple shifts at the same time.' };
            if (shiftStart <= shiftStart && shiftEnd > shiftStart && shiftEnd <= shiftEnd) return { isValid: false, message: 'You cannot have multiple shifts at the same time.' };
            if (shiftStart > shiftStart && shiftStart < shiftEnd && shiftEnd >= shiftEnd) return { isValid: false, message: 'You cannot have multiple shifts at the same time.' };
        }

        return { isValid: false, message: 'This shift is not valid.' };
    };

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
                return;
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create Shift</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please select the position for each user:</p>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Form>
                        {selectedUsers.map((user) => (
                            <div key={user.IAM} className="mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleRemoveUser(user.IAM)}
                                    >
                                        X
                                    </Button>
                                    <span className="ml-2">{`${user.firstName} ${user.lastName}`}</span>
                                </div>
                                {user.selected && (
                                    <Form.Group controlId={`positionSelect-${user.IAM}`}>
                                        <Form.Label>Select Position</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={user.position}
                                            onChange={(e) => handleSelectPosition(e, user.IAM)}
                                        >
                                            <option value="">Choose...</option>
                                            {getAllowedPositions(user.operationalPosition).map((position) => (
                                                <option key={position} value={position}>
                                                    {position}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                )}
                            </div>
                        ))}
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleCreateShift}>
                    Create Shift
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const getAllowedPositions = (operationalPosition) => {
    switch (operationalPosition) {
        case 'Stagiaire Bin.':
            return ['Stagiaire Bin.'];
        case 'Equipier Bin.':
            return ['Equipier Bin.'];
        case 'Chef Agres':
            return ['Chef Agres', 'Equipier Bin.'];
        default:
            return [];
    }
};

export default MarkBesetztModal;


const createShiftDB = async (data) => {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        notifyUser(element, data);
    }
    try {
        const res = await fetch('/api/v1/shift/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shifts: data }),
        });
        const json = await res.json();
        return json;
    } catch (err) {
        console.error(err);
    }
}

const notifyUser = async (shift, allShifts) => {
    const { IAM, firstName, lastName, position, startDate, endDate } = shift;
    const partnerInfo = {
        IAMs: [],
        firstNames: [],
        lastNames: [],
        positions: [],
    };

    for (let i = 0; i < allShifts.length; i++) {
        if (allShifts[i].IAM === IAM) continue;

        partnerInfo.IAMs.push(allShifts[i].IAM);
        partnerInfo.firstNames.push(allShifts[i].firstName);
        partnerInfo.lastNames.push(allShifts[i].lastName);
        partnerInfo.positions.push(allShifts[i].position);
    }

    const res = await getMember(IAM);

    const data = res.data;
    const email = data.email;

    const formattedStartDate = formatDate(new Date(startDate));
    const startTimeStr = formatTime(new Date(startDate));
    const endTimeStr = formatTime(new Date(endDate));


    const res2 = await fetch('/api/v1/user/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            emailBody: {
                to: email,
                subject: 'Permanence Notification',
                text: `Hello ${firstName} ${lastName},\n\nYou have been assigned to a shift on the ${formattedStartDate} from ${startTimeStr} to ${endTimeStr}.\n\nYou're assigned as a "${position}".\n\nYour partner(s) are:\n${partnerInfo.firstNames.map((name, index) => `${name} ${partnerInfo.lastNames[index]} as a "${partnerInfo.positions[index]}"`).join('\n')}`,
            }
        }),
    });
    const json = await res2.json();
    return json;
}

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const getAvailabilities = async (id) => {
    try {
        const res = await fetch(`/api/v1/availability/get-by-id/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();

        return data;
    } catch (err) {
        console.error(err);
    }
}

const createAvailability = async (data) => {
    const { IAM, startTime, endTime } = data;

    console.log(IAM, startTime, endTime);
    // Ensure start and endtime arent the same

    try {
        const res = await fetch('/api/v1/availability/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ IAM, startTime, endTime }),
        });
        const json = await res.json();
        return json;
    } catch (err) {
        console.error(err);
    }
}