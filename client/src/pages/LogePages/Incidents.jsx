import { Button, Col, Row } from 'react-bootstrap';
import IncidentCard from './IncidentCard';
import { useEffect, useState } from 'react';
import { useApiClient } from '../../ApiContext';

const Incidents = () => {
    const [incidents, setIncidents] = useState([]);
    const marginPx = 5; // Adjust margin as needed

    const apiClient = useApiClient();

    useEffect(() => {
        async function fetchData() {
            const incidents = await apiClient.incident.get();
            setIncidents(incidents);
        }

        fetchData();
    }, [apiClient.incident]);

    return (
        <div className='select-none'>
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