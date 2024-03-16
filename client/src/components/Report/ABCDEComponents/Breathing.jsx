/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Container } from 'react-bootstrap';

const Breathing = ({ value = {}, onChange }) => {
    const [showMeasures, setShowMeasures] = useState(false);
    const [showSauerstoffgabe, setShowSauerstoffgabe] = useState(false);

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
            updatedValue.breathingSpeed = '';
            updatedValue.auskultation = false;
            updatedValue.thorax = '';
            updatedValue.sauerstoffgabe = '';
            updatedValue.brille = false;
            updatedValue.maske = false;
            updatedValue.beatmungsbeutel = false;
            updatedValue.assistierteBeatmung = false;
            updatedValue.hyperventilationsmaske = false;
            updatedValue.oberkörperhochlagerung = false;
        }

        onChange('breathing', 'problem', isChecked);
    };

    const handleRadioChange = (field, value) => {
        onChange('breathing', field, value);
    };

    const handleMeasureChange = (measure) => {
        if (measure === 'sauerstoffgabe') {
            setShowSauerstoffgabe(!showSauerstoffgabe);
        }
        onChange('breathing', measure, !value[measure]);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Breathing</Form.Label>
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
                <Card body>
                    <Container>
                        <Row>
                            <Col>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Form.Label>Diagnostic</Form.Label>
                                        <hr />
                                        <Form.Group className="mb-3">
                                            <Form.Label>Breathing Speed</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={value.breathingSpeed || ''}
                                                onChange={(e) => onChange('breathing', 'breathingSpeed', e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                <option value="Aupnoe (Keine)">Aupnoe (Keine)</option>
                                                <option value="Bradypnoe (langsam)">Bradypnoe (langsam)</option>
                                                <option value="Eupnoe (normal)">Eupnoe (normal)</option>
                                                <option value="Tachypnoe (schnell)">Tachypnoe (schnell)</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Auskultation seitengleich"
                                                checked={value.auskultation || false}
                                                onChange={() => handleMeasureChange('auskultation')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Thorax</Form.Label>
                                            <div>
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Stabil"
                                                    name="thorax"
                                                    checked={value.thorax === 'Stabil'}
                                                    onChange={() => handleRadioChange('thorax', 'Stabil')}
                                                />
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Instabil"
                                                    name="thorax"
                                                    checked={value.thorax === 'Instabil'}
                                                    onChange={() => handleRadioChange('thorax', 'Instabil')}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Form.Label>Measures</Form.Label>
                                        <hr />
                                        <Form.Check
                                            type="checkbox"
                                            label="Sauerstoffgabe"
                                            checked={value.sauerstoffgabe || false}
                                            onChange={() => handleMeasureChange('sauerstoffgabe')}
                                        />
                                        {showSauerstoffgabe && (
                                            <Form.Group className="mb-3">
                                                <Form.Label>Sauerstoffgabe (l/min)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={value.sauerstoffgabe || ''}
                                                    onChange={(e) => onChange('breathing', 'sauerstoffgabe', e.target.value)}
                                                />
                                            </Form.Group>
                                        )}
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Brille"
                                                checked={value.brille || false}
                                                onChange={() => handleMeasureChange('brille')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Maske"
                                                checked={value.maske || false}
                                                onChange={() => handleMeasureChange('maske')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Beatmungsbeutel"
                                                checked={value.beatmungsbeutel || false}
                                                onChange={() => handleMeasureChange('beatmungsbeutel')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Assistierte/kontrollierte Beatmung"
                                                checked={value.assistierteBeatmung || false}
                                                onChange={() => handleMeasureChange('assistierteBeatmung')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Hyperventilationsmaske"
                                                checked={value.hyperventilationsmaske || false}
                                                onChange={() => handleMeasureChange('hyperventilationsmaske')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Oberkörperhochlagerung"
                                                checked={value.oberkörperhochlagerung || false}
                                                onChange={() => handleMeasureChange('oberkörperhochlagerung')}
                                            />
                                        </Form.Group>
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

export default Breathing;
