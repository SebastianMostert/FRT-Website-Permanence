import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckMedical } from '@fortawesome/free-solid-svg-icons';
import { useApiClient } from '../../contexts/ApiContext';

const IncidentCreate = () => {
    const [name, setName] = useState('');
    const [team, setTeam] = useState('');
    const [teams, setTeams] = useState([]);
    const [incidentInfo, setIncidentInfo] = useState('');
    const [location, setLocation] = useState('');
    const [ambulanceCalled, setAmbulanceCalled] = useState(false);
    const [error, setError] = useState(false);

    const apiClient = useApiClient();

    const handleSubmit = (event) => {
        event.preventDefault();
        async function postData() {
            await apiClient.incident.create({
                ambulanceCalled,
                incidentInfo,
                location,
                name,
                teamId: team,
            });
        }

        postData();

        setName('');
        setIncidentInfo('');
        setLocation('');
        setAmbulanceCalled(false);
        setError(false);
    };

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/v1/team/fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            console.log(data);
            const filteredTeams = data.filter(team => (team.status === "1" || team.status === "2") && !team.alerted);
            if (filteredTeams.length > 0) {
                setError(false);
                setTeams(filteredTeams);
                setTeam(filteredTeams[0]._id); // Assuming '_id' is the correct property name for team ID
            } else {
                setError(true);
            }
        }

        fetchData();
    }, []);


    const filteredTeams = teams.filter(team => (team.status === "1" || team.status === "2") && !team.alerted);

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
                    {/* Name */}
                    <Form.Group controlId="formName" className="mb-3">
                        <Form.Label className="fw-bold">Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>

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
