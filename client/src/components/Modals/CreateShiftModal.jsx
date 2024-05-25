import { useEffect, useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const componentTranslationName = 'create_shift_modal';

// eslint-disable-next-line react/prop-types
const CreateAvailabilityModal = ({ show, handleClose }) => {
    const { t } = useTranslation();
    // State for form inputs
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [usersPosition, setUsersPosition] = useState({});
    const [teams, setTeams] = useState([]);
    const [selectedTeamID, setSelectedTeamID] = useState(null);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleUsersChange = (selectedOptions) => {
        setSelectedUsers(selectedOptions);
    };

    const handlePositionChange = (selectedOption, userId) => {
        setUsersPosition({
            ...usersPosition,
            [userId]: selectedOption.value, // Store the selected position value
        });
    };

    const handleTeamChange = (e) => {
        const value = e.value;

        setSelectedTeamID(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const users = selectedUsers.map(user => {
            const { value, user: _user } = user;

            // Get the selected position value
            const selectedPosition = usersPosition[value];

            const { firstName, lastName, IAM } = _user;

            return {
                IAM,
                firstName,
                lastName,
                position: selectedPosition,
            }
        });

        // Create shift
        const shiftObj = {
            startDate: new Date(date + ' ' + startTime),
            endDate: new Date(date + ' ' + endTime),
            title,
            users,
            teamID: selectedTeamID,
        }

        createShift(shiftObj);
    };

    useEffect(() => {
        const getUsers = async () => {
            const response = await fetch('/api/v1/user/fetch-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            const _users = data.map((user) => ({
                value: user._id,
                label: `${user.firstName[0].toUpperCase()}. ${user.lastName} (${user.IAM})`,
                user: user
            }))

            setUsers(_users);
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

                const teams = [];

                // Loop through the data and create an option object for each team
                data.forEach((team) => {
                    const { active } = team;
                    if (!active) return;

                    teams.push(team);
                });

                // Set the data in the state
                setTeams(teams);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTeams();
        getUsers();
    }, []);

    const positions = [{
        value: 'Chef Agres',
        label: 'Chef Agres',
    }, {
        value: 'Equipier Bin.',
        label: 'Equipier Bin.',
    }, {
        value: 'Stagiaire Bin.',
        label: 'Stagiaire Bin.',
    }];

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-center">{t(`${componentTranslationName}.title`)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="title" className="mb-3">
                        <Form.Label>{t(`${componentTranslationName}.title`)}</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            required
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
                    <Form.Group controlId="users" className="mb-3">
                        <Form.Label>{t(`${componentTranslationName}.users`)}</Form.Label>
                        <Select
                            value={selectedUsers}
                            onChange={handleUsersChange}
                            options={users}
                            isMulti
                        />
                    </Form.Group>
                    {/* Add input fields based on selected users */}
                    {selectedUsers.map((user, index) => (
                        <Form.Group key={index} controlId={`user-${index}`} className="mb-3">
                            <Form.Label>{user.label}&apos;s Position</Form.Label>
                            <Select
                                value={positions.find(pos => pos.value === usersPosition[user.user._id])} // Set the selected option based on usersPosition
                                onChange={(selectedOption) => handlePositionChange(selectedOption, user.user._id)} // Pass the selected option and user ID
                                options={positions}
                            />
                        </Form.Group>
                    ))}
                    <Form.Group controlId="date" className="mb-3">
                        <Form.Label>{t(`${componentTranslationName}.date`)}</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            required
                        />
                    </Form.Group>
                    <Form.Label>{t(`${componentTranslationName}.time_range`)}</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="time"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            required
                            min="08:00"
                            max="18:00"
                        />
                        <Form.Control
                            type="time"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            required
                            min="08:00"
                            max="18:00"
                        />
                    </InputGroup>
                    <div className="d-grid mt-3">
                        <Button variant="success" type="submit">
                            {t('button.create')}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('button.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateAvailabilityModal;


async function createShift(shiftObj) {
    const res = await fetch('/api/v1/shift/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(shiftObj),
    })

    await res.json();
}