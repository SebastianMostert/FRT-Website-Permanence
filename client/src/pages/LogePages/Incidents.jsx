import { Button, Col, Row } from 'react-bootstrap';
import IncidentCard from './IncidentCard';

// TODO: Fetch data from API
const incidents = [
    {
        missionNumber: 1,
        name: 'Incident 1',
        teamId: 1,
        incidentInfo: 'Incident Info 1',
        location: 'Location 1',
        ambulanceCalled: false,
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }),
    },
    {
        missionNumber: 1,
        name: 'Incident 1',
        teamId: 1,
        incidentInfo: 'Incident Info 1',
        location: 'Location 1',
        ambulanceCalled: false,
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }),
    },
    {
        missionNumber: 1,
        name: 'Incident 1',
        teamId: 1,
        incidentInfo: 'Incident Info 1',
        location: 'Location 1',
        ambulanceCalled: false,
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }),
    },
    {
        missionNumber: 1,
        name: 'Incident 1',
        teamId: 1,
        incidentInfo: 'Incident Info 1',
        location: 'Location 1',
        ambulanceCalled: false,
        startTime: new Date().toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }),
    },
]

const Incidents = () => {
    const marginPx = 5; // Adjust margin as needed

    return (
        <div>
            <Button
                variant="danger"
                onClick={() => window.location.href = '/incidents/create'}
                style={{
                    width: `calc(100% - ${marginPx * 2}px)`,
                    margin: `${marginPx}px`,
                    height: '100px',
                }} // Subtract margin from total width
            >
                <h1>NEW INCIDENT</h1>
            </Button>

            <Row xs={1} md={2} lg={3} className="gx-3" style={{ margin: 0, padding: 0 }}>
                {incidents.map((incident) => (
                    <Col key={incident.id} style={{ marginBottom: '15px' }}>
                        <IncidentCard incident={incident} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Incidents;