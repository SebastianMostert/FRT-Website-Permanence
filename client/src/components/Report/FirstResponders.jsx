/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { isValidIAM } from '../../utils';

// TODO: Add auto complete for IAM based on team

const FirstResponders = ({ firstResponders, isEditable, setFirstResponders }) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const disabled = !isEditable;

    const handleSingleResponderChange = (field, subField, value) => {
        setFirstResponders({
            ...firstResponders,
            [field]: {
                ...firstResponders[field],
                [subField]: value,
            },
        });
    };

    const onChangeSelectedTeam = (e) => {
        const teamID = e.target.value
        const team = teams.find(team => team._id === teamID)

        setSelectedTeam(team)

        setFirstResponders({
            ...firstResponders,
            "teamID": teamID,
        });
    };

    // First we need to fetch the teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch('/api/v1/team/fetch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
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
                if (firstResponders.teamID) setSelectedTeam(teams.find(team => team._id === firstResponders.teamID))
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTeams();
    }, [firstResponders.teamID]);

    if (loading) return <>...</>;

    const postions = selectedTeam?.memberPositions || [];
    const minMembers = selectedTeam?.minMembers || 0;

    return (
        <Form.Group>
            <h5>{t('first_responders.title')}</h5>
            <hr />
            <Form.Label>{t('first_responders.team.label')}</Form.Label>
            <Form.Select
                disabled={disabled}
                value={firstResponders.teamID}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                onChange={onChangeSelectedTeam}
                required
            >
                <option value="">{t('first_responders.team.placeholder')}</option>
                {teams.map((team) => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                ))}
            </Form.Select>
            <hr />
            {/* Loop over the positions and render the inputs */}
            {postions.map((position, index) => {
                const formattedPosition = formatPosition(position);
                const value = firstResponders[formattedPosition]?.IAM || '';

                // If the current index is less than the minimum number of members, make the input required
                const required = index < minMembers;

                const { minLength, feedback, valid } = isValid(required, value, t);

                console.log({ minLength, feedback });

                return (
                    <Row key={position} className="mb-3">
                        <Col sm={8} className="mx-auto">
                            <Form.Label>{position}</Form.Label>
                            <Form.Control
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                type="text"
                                placeholder={t('first_responders.iam.placeholder')}
                                value={value}
                                onChange={(e) => handleSingleResponderChange(formattedPosition, 'IAM', e.target.value)}
                                minLength={minLength}
                                maxLength={8}
                                required={required}
                                isInvalid={!valid}
                            />
                            <Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback>
                        </Col>
                    </Row>
                )
            })}
        </Form.Group>
    );
};

export default FirstResponders;

function isValid(isRequired, IAM, t) {
    let minLength = 0;
    let feedback = '';
    let valid = true;

    function setFeedback(_feedback) {
        feedback = _feedback;
        valid = false;

        // Setting this to any number higher than 8 will ensure an error message is shown
        minLength = 9;
    }


    // If 
    if (isRequired) {
        const { valid, message } = isValidIAM(IAM, t);

        if (!valid) {
            setFeedback(message);
        }
    }

    return { minLength, feedback, valid };
}

function formatPosition(position) {
    let formattedPosition;

    // set to lower case
    formattedPosition = position.toLowerCase();

    // Remove bin.
    formattedPosition = formattedPosition.replace(' bin.', 'Bin');

    // conver to camel case: Chef Agres -> chefAgres
    formattedPosition = camelCase(formattedPosition);

    return formattedPosition;
}

function camelCase(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
}