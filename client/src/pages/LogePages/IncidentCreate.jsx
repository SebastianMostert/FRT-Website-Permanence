import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckMedical } from '@fortawesome/free-solid-svg-icons';
import { useApiClient } from '../../contexts/ApiContext';
import Slider from '@mui/material/Slider';
import { useTranslation } from 'react-i18next';

const IncidentCreate = () => {
    const [name, setName] = useState('');
    const [team, setTeam] = useState('');
    const [teams, setTeams] = useState([]);
    const [gravity, setGravity] = useState(4);
    const [incidentInfo, setIncidentInfo] = useState('');
    const [location, setLocation] = useState('');
    const [ambulanceCalled, setAmbulanceCalled] = useState(false);
    const [error, setError] = useState(false);

    const { t } = useTranslation();

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
                urgenceLevel: gravity,
            });
        }

        postData();
        setName('');
        setIncidentInfo('');
        setLocation('');
        setGravity(4);
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

    const marks = [
        {
            value: 0,
            label: 'U4',
        },
        {
            value: 1,
            label: 'U3',
        },
        {
            value: 2,
            label: 'U2',
        },
        {
            value: 3,
            label: 'U1',
        },
    ];


    function valuetext(level) {
        return `U${level}`;
    }

    function valueLabelFormat(level) {
        let msg;

        switch (level) {
            case 4:
                msg = t(`emergency_level.4`);
                break;
            case 3:
                msg = t(`emergency_level.3`);
                break;
            case 2:
                msg = t(`emergency_level.2`);
                break;
            case 1:
                msg = t(`emergency_level.1`);
                break;
        }
        return msg;
    }

    function valueToLevel(value) {
        const level = value === 0 ? 4 : value === 1 ? 3 : value === 2 ? 2 : 1;
        return level;
    }

    function levelToValue(level) {
        const value = level === 4 ? 0 : level === 3 ? 1 : level === 2 ? 2 : 3;
        return value;
    }

    return (
        <Container className="mt-5 select-none">
            <h1 className="mb-4">{t('incident_create.title')}</h1>
            {error ? (
                <Alert variant="danger">{t('incident_create.no_team')}</Alert>
            ) : (
                <>
                    {gravity <= 2 && ambulanceCalled == false && <Alert variant="warning">{t('incident_create.ambulance_warning', { emergency_level_msg: valueLabelFormat(gravity), emergency_level: valuetext(gravity) })}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        {/* Team Selection */}
                        <Form.Group controlId="formTeam" className="mb-3">
                            <Form.Label className="fw-bold">{t('incident_create.team')}</Form.Label>
                            <Form.Select value={team} onChange={(e) => setTeam(e.target.value)} required>
                                {filteredTeams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Incident Information */}
                        <Form.Group controlId="formIncidentInfo" className="mb-3">
                            <Form.Label className="fw-bold">{t('incident_create.incident_info')}</Form.Label>
                            <Form.Control as="textarea" placeholder="Enter incident information" value={incidentInfo} onChange={(e) => setIncidentInfo(e.target.value)} rows={5} required />
                        </Form.Group>

                        {/* Location */}
                        <Form.Group controlId="formLocation" className="mb-3">
                            <Form.Label className="fw-bold">{t('incident_create.location')}</Form.Label>
                            <Form.Control type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        </Form.Group>

                        {/* Gravity of Incident */}
                        <Form.Group controlId='formGravity' className="mb-3">
                            <Slider
                                aria-labelledby="track-inverted-slider"
                                getAriaValueText={(value) => valuetext(valueToLevel(value))}
                                defaultValue={0}
                                value={levelToValue(gravity)}
                                valueLabelDisplay='auto'
                                valueLabelFormat={(value) => valueLabelFormat(valueToLevel(value))}
                                onChange={(e, value) => setGravity(valueToLevel(value))}
                                marks={marks}
                                min={0}
                                max={3}
                            />
                        </Form.Group>

                        {/* Ambulance Called */}
                        <Form.Group controlId="formAmbulanceCalled" className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label={<><FontAwesomeIcon icon={faTruckMedical} />{' '}{t('incident_create.ambulance_called')}</>}
                                checked={ambulanceCalled}
                                onChange={(e) => setAmbulanceCalled(e.target.checked)}
                                style={{ fontSize: '1.25rem', fontWeight: 'bold' }} // Customize checkbox style
                            />
                        </Form.Group>

                        {/* Submit Button */}
                        <div className="d-grid">
                            <Button variant="primary" type="submit">{t('button.create_incident')}</Button>
                        </div>
                    </Form>
                </>
            )}
        </Container>
    );
};

export default IncidentCreate;
