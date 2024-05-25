import { useEffect, useState } from 'react';
import { Card, Badge, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const IncidentCard = ({ incident }) => {
    const { t } = useTranslation();

    // const { name, incidentInfo, location, ambulanceCalled } = incident;
    const { firstResponders, missionNumber, missionInfo } = incident;
    const { ambulanceCalled, quickReport, location, callTime } = missionInfo;

    // The first 8 numbers of the mission number are the year, month, and day YYYYMMDD 
    const strMissionNumber = missionNumber.toString();

    const year = strMissionNumber.substring(0, 4);
    const month = strMissionNumber.substring(4, 6);
    const day = strMissionNumber.substring(6, 8);

    const weekdayName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { weekday: 'long' }); // Monday, Tuesday, Wednesday, ...
    const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'long' }); // May, June, July, ...
    const daySuffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';

    const formattedDate = `${weekdayName}, ${monthName} ${day}${daySuffix}, ${year}`;
    const formattedTime = callTime;
    const formattedDateAndTime = `Incident on ${formattedDate} at ${formattedTime}`

    const user = []

    // Go through the first responders object and add them to the user array
    for (const key in firstResponders) {
        if (Object.prototype.hasOwnProperty.call(firstResponders, key)) {
            if(key == 'teamID') continue
            const element = firstResponders[key];
            user.push(element);
        }
    }

    return (
        <Card className="shadow-sm mb-4">
            <Card.Body>
                <Card.Title className="mb-3">{formattedDateAndTime}</Card.Title>

                <InfoRow label={t('status.incident_info')} value={quickReport} />
                <InfoRow label={t('status.location')} value={location} />
                <AmbulanceStatus label={t('status.ambulance_called')} ambulanceCalled={ambulanceCalled} />

                <div>
                    <strong>{t('status.team_members')}</strong>
                    <Accordion flush>
                        {user.map((member, index) => (
                            <UserAccordion key={index} user={member} index={index} />
                        ))}
                    </Accordion>
                </div>
            </Card.Body>
        </Card>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="mb-3">
        <strong>{label}</strong>
        {value.split('\n').map((part, index) => (
            <div key={index}>{part}</div>
        ))}
    </div>
);

const AmbulanceStatus = ({ label, ambulanceCalled }) => (
    <div className="mb-3">
        <strong>{label}</strong>
        <Badge bg={ambulanceCalled ? 'success' : 'danger'}>{ambulanceCalled ? 'Yes' : 'No'}</Badge>
    </div>
);

const UserAccordion = ({ user, index }) => {
    const [fullUser, setFullUser] = useState({});

    const { t } = useTranslation();
    const { position, IAM } = user;

    // Fetch the full user
    useEffect(() => {
        if (!position || !IAM) return;
        async function fetchUser() {
            const res = await fetch(`/api/v1/user/fetch/${IAM}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setFullUser(data._doc);
        }
        fetchUser();
    }, [IAM, position]);

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
                    <strong>IAM:</strong> {IAM}
                </div>
            </Accordion.Body>
        </Accordion.Item>
    );
};

AmbulanceStatus.propTypes = {
    label: PropTypes.string.isRequired,
    ambulanceCalled: PropTypes.bool.isRequired
};

InfoRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

IncidentCard.propTypes = {
    incident: PropTypes.shape({
        firstResponders: PropTypes.array.isRequired,
        missionNumber: PropTypes.number.isRequired,
        missionInfo: PropTypes.object.isRequired
    }).isRequired
};

UserAccordion.propTypes = {
    user: PropTypes.shape({
        position: PropTypes.string.isRequired,
        IAM: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired
};

export default IncidentCard;
