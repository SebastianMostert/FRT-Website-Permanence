/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Table, InputGroup, FloatingLabel } from 'react-bootstrap';

const Disability = ({ value = {}, onChange, isEditable }) => {
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
            updatedValue.avpu = '';
            updatedValue.movement = '';
            updatedValue.dmsExtremitäten = false;
            updatedValue.pulsRegelmäßig = '';
            updatedValue.pulsTastbar = '';
            updatedValue.bpm = '';
            updatedValue.sys = '';
            updatedValue.dia = '';
            updatedValue.avpu = '';
            updatedValue.movement = '';
            updatedValue.dmsExtremitäten = false;
            updatedValue.fastProblem = false;
            updatedValue.face = false;
            updatedValue.arms = false;
            updatedValue.speech = false;
            updatedValue.time = false;
            updatedValue.pupillenRight = '';
            updatedValue.pupillenLeft = '';
            updatedValue.pupillenLeftLicht = false;
            updatedValue.pupillenRightLicht = false;
            updatedValue.temperature = '';
            updatedValue.bloodSugar = '';
        }

        onChange('disability', 'problem', isChecked);
    };

    const handleRadioChange = (field, value) => {
        onChange('disability', field, value);
    };

    const handleMeasureChange = (measure) => {
        onChange('disability', measure, !value[measure]);
    };

    const renderPupillenTable = () => {
        const pupillenOptions = ['Eng', 'Normal', 'Weit', 'Entrundet'];

        return (
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>Pupillen</th>
                        <th>Right</th>
                        <th>Left</th>
                    </tr>
                </thead>
                <tbody>
                    {pupillenOptions.map((option, index) => (
                        <tr key={index}>
                            <td>{option}</td>
                            <td>
                                <Form.Check
                                    inline
                                    type="checkbox"
                                    checked={value.pupillenRight === option}
                                    onChange={() => handleRadioChange('pupillenRight', option)}
                                />
                            </td>
                            <td>
                                <Form.Check
                                    inline
                                    type="checkbox"
                                    checked={value.pupillenLeft === option}
                                    onChange={() => handleRadioChange('pupillenLeft', option)}
                                />
                            </td>
                        </tr>
                    ))}
                    <tr key={4}>
                        <td>{'Lichtreaktiv'}</td>
                        <td>
                            <Form.Check
                                inline
                                type="checkbox"
                                checked={value.pupillenRightLicht}
                                onChange={() => handleMeasureChange('pupillenRightLicht')}
                            />
                        </td>
                        <td>
                            <Form.Check
                                inline
                                type="checkbox"
                                checked={value.pupillenLeftLicht}
                                onChange={() => handleMeasureChange('pupillenLeftLicht')}
                            />
                        </td>
                    </tr>
                </tbody>

            </Table>
        );
    };

    const renderBewegungTable = () => {
        const bewegungOptions = ['Normal', 'Eingeschränkt', 'Fehlt'];

        return (
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>Bewegung</th>
                        <th>Right</th>
                        <th>Left</th>
                    </tr>
                </thead>
                <tbody>
                    {bewegungOptions.map((option, index) => (
                        <tr key={index}>
                            <td>{option}</td>
                            <td>
                                <Form.Check
                                    inline
                                    type="checkbox"
                                    checked={value.bewegungRight === option}
                                    onChange={() => handleRadioChange('bewegungRight', option)}
                                />
                            </td>
                            <td>
                                <Form.Check
                                    inline
                                    type="checkbox"
                                    checked={value.bewegungLeft === option}
                                    onChange={() => handleRadioChange('bewegungLeft', option)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const handleInputChange = (field, inputValue) => {
        onChange('disability', field, inputValue);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Disability</Form.Label>
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
                            <Card className="mb-3">
                                <Card.Body>
                                    <Form.Label>Diagnostic</Form.Label>
                                    <hr />
                                    <Form.Group className="mb-3">
                                        {renderBewegungTable()}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        {renderPupillenTable()}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>AVPU</Form.Label>
                                        <div>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label="Alert"
                                                name="avpu"
                                                checked={value.avpu === 'Alert'}
                                                onChange={() => handleRadioChange('avpu', 'Alert')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label="Voice"
                                                name="avpu"
                                                checked={value.avpu === 'Voice'}
                                                onChange={() => handleRadioChange('avpu', 'Voice')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label="Pain"
                                                name="avpu"
                                                checked={value.avpu === 'Pain'}
                                                onChange={() => handleRadioChange('avpu', 'Pain')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label="Unresponsive"
                                                name="avpu"
                                                checked={value.avpu === 'Unresponsive'}
                                                onChange={() => handleRadioChange('avpu', 'Unresponsive')}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="DMS Extremitäten problem?"
                                            checked={value.dmsExtremitäten || false}
                                            onChange={() => handleMeasureChange('dmsExtremitäten')}
                                        />
                                        {value.dmsExtremitäten && (
                                            <>
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="checkbox"
                                                    label="Durchblutung"
                                                    checked={value.durchblutung || false}
                                                    onChange={() => handleMeasureChange('durchblutung')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="checkbox"
                                                    label="Motorik"
                                                    checked={value.motorik || false}
                                                    onChange={() => handleMeasureChange('motorik')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="checkbox"
                                                    label="Sensorik"
                                                    checked={value.sensorik || false}
                                                    onChange={() => handleMeasureChange('sensorik')}
                                                />
                                            </>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label="FAST-Problem"
                                            checked={value.fastProblem || false}
                                            onChange={() => handleMeasureChange('fastProblem')}
                                        />
                                        {value.fastProblem && (
                                            <>
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="checkbox"
                                                    label="Face"
                                                    checked={value.face || false}
                                                    onChange={() => handleMeasureChange('face')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="checkbox"
                                                    label="Arms"
                                                    checked={value.arms || false}
                                                    onChange={() => handleMeasureChange('arms')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="checkbox"
                                                    label="Speech"
                                                    checked={value.speech || false}
                                                    onChange={() => handleMeasureChange('speech')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="checkbox"
                                                    label="Time"
                                                    checked={value.time || false}
                                                    onChange={() => handleMeasureChange('time')}
                                                    className="mb-3"
                                                />
                                                {value.time && (
                                                    <Form.Group className="mb-3">
                                                        <FloatingLabel label="Symptom Onset">
                                                            <Form.Control
                                                                disabled={disabled}
                                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                                type="time"
                                                                value={value.fastSymptomOnset || ''}
                                                                onChange={(e) => handleInputChange('fastSymptomOnset', e.target.value)}
                                                            />
                                                        </FloatingLabel>
                                                    </Form.Group>
                                                )}
                                                <Form.Group className="mb-3">
                                                    <Form.Label>FAST Details</Form.Label>
                                                    <Form.Control
                                                        disabled={disabled}
                                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                        as="textarea"
                                                        rows={3}
                                                        value={value.fastDetails || ''}
                                                        onChange={(e) => handleInputChange('fastDetails', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <InputGroup>
                                            <InputGroup.Text>Temperature</InputGroup.Text>
                                            <Form.Control
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="number"
                                                value={value.temperature || ''}
                                                onChange={(e) => handleInputChange('temperature', e.target.value)}
                                            />
                                            <InputGroup.Text>°C</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <InputGroup>
                                                <InputGroup.Text>Blood Sugar</InputGroup.Text>
                                                <Form.Control
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="number"
                                                    value={value.bloodSugar || ''}
                                                    onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                                                    className="ml-2"
                                                />
                                                <InputGroup.Text>mg/dL</InputGroup.Text>
                                            </InputGroup>
                                        </div>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            )}
        </Form.Group>
    );
};

export default Disability;
