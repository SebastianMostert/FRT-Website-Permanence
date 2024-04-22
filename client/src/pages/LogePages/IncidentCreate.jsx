import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckMedical } from '@fortawesome/free-solid-svg-icons';

// TODO: Fetch data from API
const startTime = new Date().toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' });
const endTime = new Date(new Date().setHours(new Date().getHours() + 2)).toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' });
const members = [
    { "id": 1, "firstName": "Pol", "lastName": "Nilles", "position": "Chef Agres", "IAM": "NilPo732" },
    { "id": 2, "firstName": "Sebastian", "lastName": "Mostert", "position": "Equipier Bin.", "IAM": "MosSe842" },
];
const teams = [
    { id: 1, name: 'FRT-LLIS 1', members, alerted: false, status: 1, startTime, endTime },
    { id: 2, name: 'FRT-LLIS 2', members, alerted: false, status: 2, startTime, endTime },
    { id: 3, name: 'FRT-LLIS 3', members, alerted: true, status: 1, startTime, endTime },
    { id: 4, name: 'FRT-LLIS 4', members, alerted: true, status: 2, startTime, endTime },
    { id: 5, name: 'FRT-LLIS 5', members, alerted: false, status: 3, startTime, endTime },
    { id: 6, name: 'FRT-LLIS 6', members, alerted: false, status: 4, startTime, endTime },
    { id: 7, name: 'FRT-LLIS 7', members, alerted: false, status: 6, startTime, endTime },
];

const IncidentCreate = () => {
    const [name, setName] = useState('');
    const [team, setTeam] = useState('');
    const [incidentInfo, setIncidentInfo] = useState('');
    const [location, setLocation] = useState('');
    const [ambulanceCalled, setAmbulanceCalled] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setName('');
        setIncidentInfo('');
        setLocation('');
        setAmbulanceCalled(false);
        setError(false);
    };

    const filteredTeams = teams.filter(team => (team.status === 1 || team.status === 2) && !team.alerted);

    useEffect(() => {
        if (filteredTeams.length > 0) {
            setError(false);
            setTeam(filteredTeams[0].id);
        } else {
            setError(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container className="mt-5 select-none">
            <h1 className="mb-4">New Incident</h1>
            {error ? (
                <Alert variant="danger">Unfortunately all teams are occupied. Please try again later.</Alert>
            ) : (
                <Form onSubmit={handleSubmit}>

                    {/* Team Selection */}
                    <Form.Group controlId="formTeam" className="mb-3">
                        <Form.Label className="fw-bold">Select Team:</Form.Label>
                        <Form.Select value={team} onChange={(e) => setTeam(e.target.value)} required>
                            {filteredTeams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Incident Information */}
                    <Form.Group controlId="formIncidentInfo" className="mb-3">
                        <Form.Label className="fw-bold">Incident Information:</Form.Label>
                        <Form.Control as="textarea" placeholder="Enter incident information" value={incidentInfo} onChange={(e) => setIncidentInfo(e.target.value)} rows={5} required />
                    </Form.Group>

                    {/* Location */}
                    <Form.Group controlId="formLocation" className="mb-3">
                        <Form.Label className="fw-bold">Location:</Form.Label>
                        <Form.Control type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </Form.Group>

                    {/* Ambulance Called */}
                    <Form.Group controlId="formAmbulanceCalled" className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label={<><FontAwesomeIcon icon={faTruckMedical} />{' Ambulance Called'}</>}
                            checked={ambulanceCalled}
                            onChange={(e) => setAmbulanceCalled(e.target.checked)}
                            style={{ fontSize: '1.25rem', fontWeight: 'bold' }} // Customize checkbox style
                        />
                    </Form.Group>

                    {/* Submit Button */}
                    <div className="d-grid">
                        <Button variant="primary" type="submit">Create Incident</Button>
                    </div>
                </Form>
            )}
        </Container>
    );
};

export default IncidentCreate;
