/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Container, FloatingLabel, InputGroup } from 'react-bootstrap';

const Circulation = ({ value = {}, onChange, isEditable }) => {
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
            updatedValue.pulsRegelmäßig = '';
            updatedValue.pulsTastbar = '';
            updatedValue.bpm = '';
            updatedValue.sys = '';
            updatedValue.dia = '';
            updatedValue.abdomen = '';
            updatedValue.becken = '';
            updatedValue.oberschenkel = '';
            updatedValue.ecgImage = '';
            updatedValue.spO2 = '';
        }

        onChange('circulation', 'problem', isChecked);
    };

    const handleRadioChange = (field, value) => {
        onChange('circulation', field, value);
    };

    const handleInputChange = (field, inputValue) => {
        onChange('circulation', field, inputValue);
    };

    const handleMeasureChange = (measure) => {
        onChange('circulation', measure, !value[measure]);
    };

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            onChange('circulation', 'ecgImage', e.target.result);
        };
        reader.readAsDataURL(imageFile);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Circulation</Form.Label>
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
                                        <Form.Label>Diagnostic</Form.Label>
                                        <hr />
                                        <Form.Group className="mb-3">
                                            <Form.Label>Puls Regularity</Form.Label>
                                            <div>
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Regelmäßig"
                                                    name="pulsRegelmäßig"
                                                    checked={value.pulsRegelmäßig === 'Regelmäßig'}
                                                    onChange={() => handleRadioChange('pulsRegelmäßig', 'Regelmäßig')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Unregelmäßig"
                                                    name="pulsRegelmäßig"
                                                    checked={value.pulsRegelmäßig === 'Unregelmäßig'}
                                                    onChange={() => handleRadioChange('pulsRegelmäßig', 'Unregelmäßig')}
                                                />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Puls tastbar</Form.Label>
                                            <div>
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Gut tastbar"
                                                    name="pulsTastbar"
                                                    checked={value.pulsTastbar === 'Gut tastbar'}
                                                    onChange={() => handleRadioChange('pulsTastbar', 'Gut tastbar')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Schlecht tastbar"
                                                    name="pulsTastbar"
                                                    checked={value.pulsTastbar === 'Schlecht tastbar'}
                                                    onChange={() => handleRadioChange('pulsTastbar', 'Schlecht tastbar')}
                                                />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <InputGroup>
                                                    <InputGroup.Text>BPM</InputGroup.Text>
                                                    <Form.Control
                                                        disabled={disabled}
                                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                        type="number"
                                                        value={value.bpm || ''}
                                                        onChange={(e) => handleInputChange('bpm', e.target.value)}
                                                        className="ml-2"
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <InputGroup>
                                                    <InputGroup.Text>SpO2</InputGroup.Text>
                                                    <Form.Control
                                                        disabled={disabled}
                                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                        type="number"
                                                        value={value.spO2 || ''}
                                                        onChange={(e) => handleInputChange('spO2', e.target.value)}
                                                        className="ml-2"
                                                    />
                                                    <InputGroup.Text>%</InputGroup.Text>
                                                </InputGroup>
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FloatingLabel label="SYS" className="mb-3 me-2">
                                                    <Form.Control
                                                        disabled={disabled}
                                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                        type="number"
                                                        value={value.sys || ''}
                                                        onChange={(e) => handleInputChange('sys', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                                <span className="separator">/</span>
                                                <FloatingLabel label="DIA" className="mb-3 ms-2">
                                                    <Form.Control
                                                        disabled={disabled}
                                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                        type="number"
                                                        value={value.dia || ''}
                                                        onChange={(e) => handleInputChange('dia', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3 d-flex align-items-center">
                                            <Form.Label className="me-2">Abdomen</Form.Label>
                                            <div>
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Weich"
                                                    name="abdomen"
                                                    checked={value.abdomen === 'Weich'}
                                                    onChange={() => handleRadioChange('abdomen', 'Weich')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Hart"
                                                    name="abdomen"
                                                    checked={value.abdomen === 'Hart'}
                                                    onChange={() => handleRadioChange('abdomen', 'Hart')}
                                                />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3 d-flex align-items-center">
                                            <Form.Label className="me-2">Becken</Form.Label>
                                            <div>
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Stabil"
                                                    name="becken"
                                                    checked={value.becken === 'Stabil'}
                                                    onChange={() => handleRadioChange('becken', 'Stabil')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Instabil"
                                                    name="becken"
                                                    checked={value.becken === 'Instabil'}
                                                    onChange={() => handleRadioChange('becken', 'Instabil')}
                                                />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3 d-flex align-items-center">
                                            <Form.Label className="me-2">Oberschenkel</Form.Label>
                                            <div>
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Stabil"
                                                    name="oberschenkel"
                                                    checked={value.oberschenkel === 'Stabil'}
                                                    onChange={() => handleRadioChange('oberschenkel', 'Stabil')}
                                                />
                                                <Form.Check
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    inline
                                                    type="radio"
                                                    label="Instabil"
                                                    name="oberschenkel"
                                                    checked={value.oberschenkel === 'Instabil'}
                                                    onChange={() => handleRadioChange('oberschenkel', 'Instabil')}
                                                />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ECG Image</Form.Label>
                                            <Form.Control
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            {value.ecgImage && (
                                                <div className="mt-2">
                                                    <img
                                                        src={value.ecgImage}
                                                        alt="ECG"
                                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Form.Label>Measures</Form.Label>
                                        <hr />
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label="Flachlagerung"
                                                checked={value.flachlagerung || false}
                                                onChange={() => handleMeasureChange('flachlagerung')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label="Schocklagerung"
                                                checked={value.schocklagerung || false}
                                                onChange={() => handleMeasureChange('schocklagerung')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label="Stabile Seitenlage"
                                                checked={value.stabileSeitenlage || false}
                                                onChange={() => handleMeasureChange('stabileSeitenlage')}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label="(Druck-)Verband/Blutstillung"
                                                checked={value.druckverband || false}
                                                onChange={() => handleMeasureChange('druckverband')}
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

export default Circulation;
