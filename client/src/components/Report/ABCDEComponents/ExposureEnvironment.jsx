/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import BodyDiagram from './BodyDiagram';

const ExposureEnvironment = ({ value = {}, onChange }) => {
    const [showMeasures, setShowMeasures] = useState(false);

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
            updatedValue.schmerzskala = 0;
            updatedValue.weitereVerletzungen = '';
        }

        onChange('exposureEnvironment', 'problem', isChecked);
    };

    const handleRangeChange = (event) => {
        const schmerzskalaValue = parseInt(event.target.value, 10);
        onChange('exposureEnvironment', 'schmerzskala', schmerzskalaValue);
    };

    const handleInputChange = (field, inputValue) => {
        onChange('exposureEnvironment', field, inputValue);
    };

    const handleMeasureChange = (measure) => {
        onChange('exposureEnvironment', measure, !value[measure]);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Exposure Environment</Form.Label>
            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <Form.Check
                        type="checkbox"
                        label="Problem?"
                        checked={value.problem || false}
                        onChange={handleCheckboxChange}
                    />
                </Col>
            </Row>
            {showMeasures && (
                <div>
                    <Card className="mb-3">
                        <Card.Body>
                            <Form.Label>Diagnostic</Form.Label>
                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Label>Schmerz: {value.schmerzskala || 0}/10</Form.Label>
                                <Form.Range
                                    type="range"
                                    label="Schmerzskala"
                                    min={0}
                                    max={10}
                                    step={1}
                                    value={value.schmerzskala || 0}
                                    onChange={handleRangeChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Body Check"
                                    checked={value.bodycheck || false}
                                    onChange={() => handleMeasureChange('bodycheck')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Weitere Verletzungen/Umfeld/sonstiges</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={value.weitereVerletzungen || ''}
                                    onChange={(e) => handleInputChange('weitereVerletzungen', e.target.value)}
                                />
                            </Form.Group>
                            <BodyDiagram letters={value} onChange={onChange} />
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Form.Label>Measures</Form.Label>
                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Wärmeerhalt"
                                    checked={value.wärmeerhalt || false}
                                    onChange={() => handleMeasureChange('wärmeerhalt')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Wundversorgung"
                                    checked={value.wundversorgung || false}
                                    onChange={() => handleMeasureChange('wundversorgung')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Extremitätenschienung"
                                    checked={value.extremitätenschienung || false}
                                    onChange={() => handleMeasureChange('extremitätenschienung')}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </Form.Group>
    );
};

export default ExposureEnvironment;
