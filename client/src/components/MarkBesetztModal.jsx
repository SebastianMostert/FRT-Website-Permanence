/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getMember } from '../utils';

const MarkBesetztModal = ({ show, handleClose, selectedSlot }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (selectedSlot) {
                const iamList = selectedSlot.IAM.split(', ');
                const availabilityIdsList = selectedSlot.availabilityIds.split(', ');

                const date = selectedSlot.date;
                const startTime = selectedSlot.startTime;
                const endTime = selectedSlot.endTime;

                // Split date into day, month, and year
                const [day, month, year] = date.split('/');

                // Split startTime and endTime into hours and minutes
                const [startHour, startMinute] = startTime.split(':');
                const [endHour, endMinute] = endTime.split(':');

                // Create startDate and endDate
                const startDate = new Date(year, month - 1, day, startHour, startMinute);
                const endDate = new Date(year, month - 1, day, endHour, endMinute);

                console.log(startDate);
                console.log(endDate);


                const users = await Promise.all(
                    iamList.map(async (iam, index) => {
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
            }
        };

        fetchUsers();
    }, [selectedSlot]);

    const handleSelectPosition = (event, userIAM) => {
        const { value } = event.target;

        setSelectedUsers((prevUsers) =>
            prevUsers.map((user) => (user.IAM === userIAM ? { ...user, position: value } : user))
        );
    };

    const handleRemoveUser = (userIAM) => {
        setSelectedUsers((prevUsers) => prevUsers.filter((user) => user.IAM !== userIAM));
    };

    const handleCreateShift = () => {
        const selectedUsersWithPosition = selectedUsers.filter((user) => user.position !== '');

        if (selectedUsersWithPosition.length === 0) {
            alert('Please select positions for at least one user.');
            return;
        }

        const chefsCount = selectedUsersWithPosition.filter(user => user.position === 'Chef Agres').length;
        const equipiersCount = selectedUsersWithPosition.filter(user => user.position === 'Equipier Bin.').length;
        const stagiairesCount = selectedUsersWithPosition.filter(user => user.position === 'Stagiaire Bin.').length;

        const valid = validateShift(chefsCount, equipiersCount, stagiairesCount);

        if (!valid) {
            alert('Invalid shift configuration. Please check the positions and number of users.');
            return;
        }

        for (let i = 0; i < selectedUsersWithPosition.length; i++) {
            const selectedUserWithPosition = selectedUsersWithPosition[i];
            deleteAvailability(selectedUserWithPosition.availabilityId, selectedUserWithPosition.IAM);
        }

        createShiftDB(selectedUsersWithPosition);

        console.log('Creating shift with selected users:', selectedUsersWithPosition);
        handleClose();
    };

    const validateShift = (chefsCount, equipiersCount, stagiairesCount) => {
        if (chefsCount + equipiersCount + stagiairesCount < 2 || chefsCount + equipiersCount + stagiairesCount > 3) {
            return false;
        }

        if (chefsCount === 1 && equipiersCount === 1 && stagiairesCount === 1) {
            return true;
        }

        if (chefsCount === 1 && equipiersCount === 1 && stagiairesCount === 0) {
            return true;
        }

        return false;
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

        // Reload the page after successful delete
        window.location.reload();
    } catch (err) {
        // Handle error, show alert, etc.
        console.error(err);
    }
};

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

    // Get the partner info from the allShifts array (ignore the current user)

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

    console.log(json);
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