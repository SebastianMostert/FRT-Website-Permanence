/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Table } from 'react-bootstrap';

const Disability = ({ value = {}, onChange }) => {
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

    return (
        <Form.Group className="mb-3">
            <Form.Label>Disability</Form.Label>
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
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Form.Label>Diagnostic</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Label>AVPU</Form.Label>
                                        <div>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Alert"
                                                name="avpu"
                                                checked={value.avpu === 'Alert'}
                                                onChange={() => handleRadioChange('avpu', 'Alert')}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Voice"
                                                name="avpu"
                                                checked={value.avpu === 'Voice'}
                                                onChange={() => handleRadioChange('avpu', 'Voice')}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Pain"
                                                name="avpu"
                                                checked={value.avpu === 'Pain'}
                                                onChange={() => handleRadioChange('avpu', 'Pain')}
                                            />
                                            <Form.Check
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
                                        <Form.Label>Movement</Form.Label>
                                        {renderBewegungTable()}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="DMS Extremitäten problem?"
                                            checked={value.dmsExtremitäten || false}
                                            onChange={() => handleMeasureChange('dmsExtremitäten')}
                                        />
                                        {value.dmsExtremitäten && (
                                            <>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Durchblutung"
                                                    checked={value.durchblutung || false}
                                                    onChange={() => handleMeasureChange('durchblutung')}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Motorik"
                                                    checked={value.motorik || false}
                                                    onChange={() => handleMeasureChange('motorik')}
                                                />
                                                <Form.Check
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
                                            type="checkbox"
                                            label="FAST-Problem"
                                            checked={value.fastProblem || false}
                                            onChange={() => handleMeasureChange('fastProblem')}
                                        />
                                        {value.fastProblem && (
                                            <>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Face"
                                                    checked={value.face || false}
                                                    onChange={() => handleMeasureChange('face')}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Arms"
                                                    checked={value.arms || false}
                                                    onChange={() => handleMeasureChange('arms')}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Speech"
                                                    checked={value.speech || false}
                                                    onChange={() => handleMeasureChange('speech')}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Time"
                                                    checked={value.time || false}
                                                    onChange={() => handleMeasureChange('time')}
                                                />
                                            </>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Pupillen right / left</Form.Label>
                                        {renderPupillenTable()}
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
