/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Container } from 'react-bootstrap';

const CriticalBleeding = ({ value = {}, onChange, isEditable }) => {
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
            updatedValue.tourniquet = false;
            updatedValue.tourniquetTime = '';
        }

        onChange('criticalBleeding', 'problem', isChecked);
    };

    const handleMeasureChange = (measure) => {
        onChange('criticalBleeding', measure, !value[measure]);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Critical Bleeding</Form.Label>
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
                    <Container>
                        <Row>
                            <Col>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Form.Label>Measures</Form.Label>
                                        <hr />
                                        <Form.Check
                                            disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="Tourniquet"
                                            checked={value.tourniquet || false}
                                            onChange={() => handleMeasureChange('tourniquet')}
                                        />
                                        {value.tourniquet && (
                                            <Row className="mb-3 align-items-center">
                                                <Col xs="auto">
                                                    <Form.Label>Time:</Form.Label>
                                                </Col>
                                                <Col xs="auto">
                                                    <Form.Control
                                                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                        type="time"
                                                        value={value.tourniquetTime || ''}
                                                        onChange={(e) =>
                                                            onChange('criticalBleeding', 'tourniquetTime', e.target.value)
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        )}
                                        <Form.Check
                                            disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="Manuelle Kompression/Blutstillung"
                                            checked={value.manualCompression || false}
                                            onChange={() => handleMeasureChange('manualCompression')}
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Card>
            )}
        </Form.Group>
    );
};

export default CriticalBleeding;
