import { useEffect, useState } from 'react';
import { Card, Badge, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const StatusBadge = ({ status, alerted }) => {
    const { t } = useTranslation();

    const getStatusDetails = () => {
        switch (status.toString()) {
            case "1":
                return { text: alerted ? '1c' : '1', variant: alerted ? 'warning' : 'secondary', description: t('status.free_on_radio') };
            case "2":
                return { text: alerted ? '2c' : '2', variant: alerted ? 'warning' : 'secondary', description: t('status.on_call') };
            case "3":
                return { text: '3', variant: 'warning', description: t('status.on_the_way_to_incident') };
            case "4":
                return { text: '4', variant: 'warning', description: t('status.at_incident') };
            case "5":
                return { text: '5', variant: 'danger', description: t('status.request_to_speak') };
            case "6":
                return { text: '6', variant: 'danger', description: t('status.unavailable') };
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
    const { t } = useTranslation();

    console.log(incident);
    // const { name, incidentInfo, location, ambulanceCalled } = incident;
    const { firstResponders, missionNumber } = incident;

    // Declare values
    const team = {
        status: '6',
        alerted: false
    }
    const ambulanceCalled = false;
    const incidentInfo = '';
    const location = '';

    // The first 8 numbers of the mission number are the year, month, and day YYYYMMDD 
    const strMissionNumber = missionNumber.toString();

    const year = strMissionNumber.substring(0, 4);
    const month = strMissionNumber.substring(4, 6);
    const day = strMissionNumber.substring(6, 8);

    const formattedDate = `${year}-${month}-${day}`;



    return (
        <Card className="shadow-sm mb-4">
            <Card.Body>
                <Card.Title className="mb-3">Incident from the {formattedDate}</Card.Title>
                <div className="mb-3 d-flex align-items-center">
                    <strong className="me-3">{t('status.team_status')}</strong>
                    <StatusBadge status={team.status} alerted={team.alerted} />
                    <Badge bg={team.alerted ? 'success' : 'danger'}>{team.alerted ? 'Alerted' : 'Not Alerted'}</Badge>
                </div>
                <div className="mb-3">
                    <strong>{t('status.incident_info')}</strong> {incidentInfo}
                </div>
                <div className="mb-3">
                    <strong>{t('status.location')}</strong> {location}
                </div>
                <div className="mb-3">
                    <strong>{t('status.ambulance_called')}</strong> <Badge bg={ambulanceCalled ? 'success' : 'danger'}>{ambulanceCalled ? 'Yes' : 'No'}</Badge>
                </div>
                <div>
                    <strong>{t('status.team_members')}</strong>
                    <Accordion flush>
                        {firstResponders.map((member, index) => (
                            <UserAccordion key={index} user={member} index={index} />
                        ))}
                    </Accordion>
                </div>
            </Card.Body>
        </Card>
    );
};

const UserAccordion = ({ user, index }) => {
    const [fullUser, setFullUser] = useState({});

    const { t } = useTranslation();
    const { position, iam } = user;

    // Fetch the full user
    useEffect(() => {
        if (!position || !iam) return;
        async function fetchUser() {
            const res = await fetch(`/api/v1/user/fetch/${iam}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setFullUser(data._doc);
        }
        fetchUser();
    }, [iam, position]);

    if (!fullUser) return null
    const { firstName, lastName } = fullUser;
    if (!firstName || !lastName) return null;

    return (
        <Accordion.Item eventKey={index.toString()}>
            <Accordion.Header>
                {`${firstName[0].toUpperCase()}. ${lastName}`}
                <span className="ms-2 text-muted">{position}</span>
            </Accordion.Header>
            <Accordion.Body>
                <div>
                    <strong>{t('status.first_name')}</strong> {firstName}
                </div>
                <div>
                    <strong>{t('status.last_name')}</strong> {lastName}
                </div>
                <div>
                    <strong>{t('status.position')}</strong> {position}
                </div>
                <div>
                    <strong>IAM:</strong> {iam}
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
        firstResponders: PropTypes.array.isRequired,
        missionNumber: PropTypes.number.isRequired
    }).isRequired
};

UserAccordion.propTypes = {
    user: PropTypes.shape({
        position: PropTypes.string.isRequired,
        iam: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired
};

export default IncidentCard;
