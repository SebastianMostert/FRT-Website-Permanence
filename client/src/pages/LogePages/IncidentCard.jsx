import { useEffect, useState } from 'react';
import { Card, Badge, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StatusBadge = ({ status, alerted }) => {
    const getStatusDetails = () => {
        switch (status.toString()) {
            case "1":
                return { text: alerted ? '1c' : '1', variant: alerted ? 'warning' : 'secondary', description: 'On the way back from incident' };
            case "2":
                return { text: alerted ? '2c' : '2', variant: alerted ? 'warning' : 'secondary', description: 'On call' };
            case "3":
                return { text: '3', variant: 'warning', description: 'On the way to incident' };
            case "4":
                return { text: '4', variant: 'warning', description: 'At the incident' };
            case "5":
                return { text: '5', variant: 'danger', description: 'Request to speak' };
            case "6":
                return { text: '6', variant: 'danger', description: 'Unavailable' };
            default:
                return { text: '', variant: 'light', description: '' };
        }
    };

    const { text, variant, description } = getStatusDetails();

    return (
        <Badge bg={variant} className="me-2">
            {text}
            <span className="visually-hidden">{description}</span>
        </Badge>
    );
};

const IncidentCard = ({ incident }) => {
    const [team, setTeam] = useState({
        name: "",
        status: "",
        alerted: false,
        members: [],
    });

    const { name, incidentInfo, location, ambulanceCalled } = incident;

    useEffect(() => {
        async function fetchTeam() {
            const res = await fetch(`/api/v1/team/fetch/${incident.teamId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setTeam(data);
        }

        fetchTeam();
    }, [incident.teamId]);

    return (
        <Card className="shadow-sm mb-4">
            <Card.Body>
                <Card.Title className="mb-3">{name}</Card.Title>
                <div className="mb-3 d-flex align-items-center">
                    <strong className="me-3">Team Status:</strong>
                    <StatusBadge status={team.status} alerted={team.alerted} />
                    <Badge bg={team.alerted ? 'success' : 'danger'}>{team.alerted ? 'Alerted' : 'Not Alerted'}</Badge>
                </div>
                <div className="mb-3">
                    <strong>Incident Information:</strong> {incidentInfo}
                </div>
                <div className="mb-3">
                    <strong>Location:</strong> {location}
                </div>
                <div className="mb-3">
                    <strong>Ambulance Called:</strong> <Badge bg={ambulanceCalled ? 'success' : 'danger'}>{ambulanceCalled ? 'Yes' : 'No'}</Badge>
                </div>
                <div>
                    <strong>Team Members:</strong>
                    <Accordion flush>
                        {team.members.map((member, index) => (
                            <UserAccordion key={index} user={member} index={index} />
                        ))}
                    </Accordion>
                </div>
            </Card.Body>
        </Card>
    );
};

const UserAccordion = ({ user, index }) => {
    return (
        <Accordion.Item eventKey={index.toString()}>
            <Accordion.Header>
                {`${user.firstName[0].toUpperCase()}. ${user.lastName}`}
                <span className="ms-2 text-muted">{user.position}</span>
            </Accordion.Header>
            <Accordion.Body>
                <div>
                    <strong>First Name:</strong> {user.firstName}
                </div>
                <div>
                    <strong>Last Name:</strong> {user.lastName}
                </div>
                <div>
                    <strong>Position:</strong> {user.position}
                </div>
                <div>
                    <strong>IAM:</strong> {user.IAM}
                </div>
            </Accordion.Body>
        </Accordion.Item>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string.isRequired,
    alerted: PropTypes.bool.isRequired
};

IncidentCard.propTypes = {
    incident: PropTypes.shape({
        name: PropTypes.string.isRequired,
        teamId: PropTypes.string.isRequired,
        incidentInfo: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        ambulanceCalled: PropTypes.bool.isRequired,
    }).isRequired
};

UserAccordion.propTypes = {
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
        IAM: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired
};

export default IncidentCard;
