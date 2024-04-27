/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getMember } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Select from 'react-select';

const MarkBesetztModal = ({ show, handleClose, shifts, event }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shiftTitle, setShiftTitle] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeamID, setSelectedTeamID] = useState(null);

    useEffect(() => {
        if (!event) return;
        if (!event.extendedProps) return;
        const overlapEvents = event.extendedProps.events;

        const IAMList = overlapEvents.map((event) => event.IAM);
        const availabilityIdsList = overlapEvents.map((event) => event._id);

        const startDate = new Date(event.start);
        const endDate = new Date(event.end);

        const fetchUsers = async () => {
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

        const fetchTeams = async () => {
            try {
                // Make a post request to the API
                const res = await fetch('/api/v1/team/fetch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Get the data from the response
                const data = await res.json();

                // Set the data in the state
                setTeams(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUsers();
        fetchTeams();
    }, [event]);

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
        // Check everything is provided
        if (!shiftTitle) return toast.error('Please provide a title for the shift');
        if (selectedTeamID === null) return toast.error('Please select a team');

        // Check that the team actually exists
        const team = teams.find((team) => team._id === selectedTeamID);
        if (!team) return toast.error('Selected team does not exist');

        // Validate shift
        const selectedUsersWithPosition = selectedUsers.filter((user) => user.position !== '');

        const valid = validateShift(selectedUsersWithPosition);

        if (!valid.isValid) {
            toast.error(valid.message);
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
                    toast.info('Create new availabilities, possibly with an API call');
                    continue;
                }
                // Implement logic to create new availabilities, possibly with an API call
                if (shiftEnd.getTime() === availabilityEnd.getTime()) {
                    toast.info('Create new availabilities, possibly with an API call');
                    continue;
                }

                createAvailability(newAvailability1);
                createAvailability(newAvailability2);
            }
        }

        try {
            console.log(selectedUsersWithPosition);
            await createShiftDB(selectedUsersWithPosition, shiftTitle, selectedTeamID);
            handleClose();
            toast.success('Shift created successfully');
        } catch (error) {
            console.error('Error creating shift:', error);
            toast.error('Failed to create shift. Please try again later.');
        }
    };

    const handleTitleChange = (event) => {
        setShiftTitle(event.target.value);
    };

    const handleTeamChange = (e) => {
        const value = e.value;

        setSelectedTeamID(value);
    };

    const validateShift = (selectedUsersWithPosition) => {
        const totalPositions = selectedUsersWithPosition.length;

        if (totalPositions === 0) return { isValid: false, message: 'Please select positions for at least one user.' };

        const chefsCount = selectedUsersWithPosition.filter(user => user.position === 'Chef Agres').length;
        const equipiersCount = selectedUsersWithPosition.filter(user => user.position === 'Equipier Bin.').length;
        const stagiairesCount = selectedUsersWithPosition.filter(user => user.position === 'Stagiaire Bin.').length;

        const threePositions = chefsCount === 1 && equipiersCount === 1 && stagiairesCount === 1;
        const twoPositions = chefsCount === 1 && equipiersCount === 1 && stagiairesCount === 0;

        if (totalPositions < 2 || totalPositions > 3) return { isValid: false, message: 'Each shift must have at least 2 and at most 3 positions.' };
        if (totalPositions === 3) if (!threePositions) return { isValid: false, message: 'You must have 1 Chef Agres, 1 Equipier Bin. and 1 Stagiaire Bin.' };
        if (totalPositions === 2) if (!twoPositions) return { isValid: false, message: 'You must have 1 Chef Agres and 1 Equipier Bin.' };

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

        return { isValid: true, message: '' };
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
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Form>
                        <Form.Group controlId="shiftTitle">
                            <Form.Label>Shift Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter shift title"
                                value={shiftTitle}
                                onChange={handleTitleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="users" className="mb-3">
                            <Form.Label>Team Selection</Form.Label>
                            <Select
                                value={selectedTeamID && {
                                    value: selectedTeamID,
                                    label: teams.find((team) => team._id === selectedTeamID)?.name,
                                }}
                                onChange={(e) => handleTeamChange(e)}
                                options={teams.map((team) => ({
                                    value: team._id,
                                    label: team.name,
                                }))}
                                required
                            />
                        </Form.Group>
                        <p>Please select the position for each user:</p>
                        {selectedUsers.map((user) => (
                            <div key={user.IAM} className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleRemoveUser(user.IAM)}
                                        className="mr-2"
                                    >
                                        <FontAwesomeIcon icon={faUserMinus} />
                                    </Button>
                                    <span>{`${user.firstName} ${user.lastName}`}</span>
                                </div>
                                <Form.Group controlId={`positionSelect-${user.IAM}`}>
                                    <Form.Label>Select Position</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={user.position}
                                        onChange={(e) => handleSelectPosition(e, user.IAM)}
                                        required
                                    >
                                        <option value="">Choose...</option>
                                        {getAllowedPositions(user.operationalPosition).map((position) => (
                                            <option key={position} value={position}>{position}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
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


const createShiftDB = async (shift, title, teamID) => {
    const startDate = new Date(shift[0].startDate);
    const endDate = new Date(shift[0].endDate);
    const users = [];

    for (let i = 0; i < shift.length; i++) {
        const element = shift[i];
        const {
            IAM,
            firstName,
            lastName,
            position,
        } = element;

        const user = {
            IAM,
            firstName,
            lastName,
            position,
        }

        users.push(user);

        notifyUser({
            allUsers: shift,
            user: user,
            startDate,
            endDate,
        });
    }

    try {
        const res = await fetch('/api/v1/shift/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startDate,
                endDate,
                title,
                users,
                teamID
            }),
        });
        const json = await res.json();

        console.log(json);
        return json;
    } catch (err) {
        console.error(err);
    }
}

const notifyUser = async ({ user, startDate, endDate, allUsers }) => {
    const { IAM, firstName, lastName, position } = user;

    const partnerInfo = {
        firstNames: [],
        lastNames: [],
        positions: [],
    };

    for (let i = 0; i < allUsers.length; i++) {
        const _user = allUsers[i];
        if (_user.IAM === IAM) continue;

        partnerInfo.firstNames.push(_user.firstName);
        partnerInfo.lastNames.push(_user.lastName);
        partnerInfo.positions.push(_user.position);
    }

    const res = await getMember(IAM);

    const data = res.data;
    const email = data.email;

    const formattedStartDate = formatDate(new Date(startDate));
    const startTimeStr = formatTime(new Date(startDate));
    const endTimeStr = formatTime(new Date(endDate));

    const partnersList = partnerInfo.firstNames.map((name, index) => `<li>${name} ${partnerInfo.lastNames[index]} - ${partnerInfo.positions[index]}</li>`).join('');

    const html = `
    <html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shift Notification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #0056b3;
            text-align: center;
            margin-bottom: 20px;
        }

        p {
            margin-bottom: 15px;
            color: #666;
        }

        ul {
            margin-top: 5px;
            margin-bottom: 20px;
            padding-left: 20px;
        }

        li {
            color: #444;
            margin-bottom: 5px;
        }

        .shift-partners {
            background-color: #f2f2f2;
            border-radius: 5px;
            padding: 10px;
        }

        .shift-partners h2 {
            color: #0056b3;
            margin-top: 0;
        }

        .shift-partners ul {
            margin-top: 5px;
            padding-left: 20px;
        }

        .shift-partners li {
            color: #666;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Shift Notification</h1>
        <p>Hello ${firstName} ${lastName},</p>
        <p>You have been added to a shift on ${formattedStartDate} from ${startTimeStr} to ${endTimeStr}.</p>
        <p>You're assigned as a "${position}".</p>
        <div class="shift-partners">
            <h2>Shift Partners:</h2>
            <ul>${partnersList}</ul>
        </div>
        <p class="footer">Thank you!</p>
    </div>
</body>

</html>`;


    // Todo fix
    if (email !== 'sebastianmostert663@gmail.com') return

    const res2 = await fetch('/api/v1/user/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            emailBody: {
                to: email,
                subject: 'Permanence Notification',
                html
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