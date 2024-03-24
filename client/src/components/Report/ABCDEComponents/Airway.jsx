/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Container } from 'react-bootstrap';

const Airway = ({ value = {}, onChange, isEditable }) => {
    const [showMeasures, setShowMeasures] = useState(false);

    const disabled = !isEditable;

    useEffect(() => {
        if (value.problem) {
            setShowMeasures(true);
        }
    }, [value]);

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setShowMeasures(isChecked);

        const updatedValue = { ...value, problem: isChecked };
        if (!isChecked) {
            updatedValue.airway = '';
            updatedValue.cervicalSpineTrauma = false;
            updatedValue.esmarch = false;
            updatedValue.guedel = false;
            updatedValue.wendl = false;
            updatedValue.absaugen = false;
            updatedValue.stiffneck = false;
        }

        onChange('airway', 'problem', isChecked);
    };

    const handleMeasureChange = (measure) => {
        onChange('airway', measure, !value[measure]);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Airway</Form.Label>
            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <Form.Check
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="checkbox"
                        label="Problem?"
                        checked={value.problem || false}
                        onChange={handleCheckboxChange}
                    />
                </Col>
            </Row>
            {showMeasures && (
                <Card body>
                    <Row>
                        <Col>
                            <Container>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Form.Label>Diagnostic</Form.Label>
                                        <hr />
                                        <Form.Group className="mb-3">
                                            <Form.Label>Airway: Free/Obstructed</Form.Label>
                                            <Form.Control
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                as="select"
                                                value={value.airway || ''}
                                                onChange={(e) => onChange('airway', 'airway', e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                <option value="Free">Free</option>
                                                <option value="Obstructed">Obstructed</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label="Cervical spine trauma"
                                                checked={value.cervicalSpineTrauma || false}
                                                onChange={() => handleMeasureChange('cervicalSpineTrauma')}
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Container>
                        </Col>
                        <Col>
                            <Container>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Form.Label>Measures</Form.Label>
                                        <hr />
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="Esmarch"
                                            checked={value.esmarch || false}
                                            onChange={() => handleMeasureChange('esmarch')}
                                        />
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="Guedel"
                                            checked={value.guedel || false}
                                            onChange={() => handleMeasureChange('guedel')}
                                        />
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="Wendl"
                                            checked={value.wendl || false}
                                            onChange={() => handleMeasureChange('wendl')}
                                        />
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="Absaugen/manuelles Freiräumen"
                                            checked={value.absaugen || false}
                                            onChange={() => handleMeasureChange('absaugen')}
                                        />
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="Stiffneck/HWS Immobilisation"
                                            checked={value.stiffneck || false}
                                            onChange={() => handleMeasureChange('stiffneck')}
                                        />
                                    </Card.Body>
                                </Card>
                            </Container>
                        </Col>
                    </Row>
                </Card>
            )}
        </Form.Group>
    );
};

export default Airway;
