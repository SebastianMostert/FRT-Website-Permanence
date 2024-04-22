import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const IncidentCard = ({ incident }) => {
    const {
        missionNumber,
        name,
        teamId,
        incidentInfo,
        location,
        ambulanceCalled,
        startTime,
        endTime
    } = incident;

    return (
        <Card>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                    <strong>Team ID:</strong> {teamId}<br />
                    <strong>Incident Information:</strong> {incidentInfo}<br />
                    <strong>Location:</strong> {location}<br />
                    <strong>Ambulance Called:</strong> {ambulanceCalled ? 'Yes' : 'No'}<br />
                    <strong>Start Time:</strong> {startTime}<br />
                    <strong>End Time:</strong> {endTime}<br />
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

IncidentCard.propTypes = {
    incident: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        teamId: PropTypes.number.isRequired,
        incidentInfo: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        ambulanceCalled: PropTypes.bool.isRequired,
        startTime: PropTypes.string.isRequired,
        endTime: PropTypes.string.isRequired
    }).isRequired
};

export default IncidentCard;
