/* eslint-disable react/prop-types */
import { Form, Row, Col, Card, Table, InputGroup, FloatingLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Disability = ({ value = {}, onChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    const handleRadioChange = (field, value) => {
        onChange('disability', field, value);
    };

    const handleMeasureChange = (measure) => {
        onChange('disability', measure, !value[measure]);
    };

    const renderPupillenTable = () => {
        const pupillenOptions = [
            t('diagnostic.pupils.tight'),
            t('diagnostic.pupils.normal'),
            t('diagnostic.pupils.wide'),
            t('diagnostic.pupils.dyscoria')
        ];

        return (
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>{t('diagnostic.pupils.label')}</th>
                        <th>{t('diagnostic.pupils.right')}</th>
                        <th>{t('diagnostic.pupils.left')}</th>
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
                        <td>{t('diagnostic.pupils.light_reaktiv')}</td>
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
        const bewegungOptions = [
            t('diagnostic.movement.normal'),
            t('diagnostic.movement.limited'),
            t('diagnostic.movement.none'),
        ];

        return (
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>{t('diagnostic.movement.label')}</th>
                        <th>{t('diagnostic.movement.right')}</th>
                        <th>{t('diagnostic.movement.left')}</th>
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
            <Card body>
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <Card.Body>
                                <Form.Label>{t('abcde.category.diagnostic')}</Form.Label>
                                <hr />
                                <Form.Group className="mb-3">
                                    {renderBewegungTable()}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    {renderPupillenTable()}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('disability.diagnostic.avpu.label')}</Form.Label>
                                    <div>
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            inline
                                            type="radio"
                                            label={t('disability.diagnostic.avpu.alert')}
                                            name="avpu"
                                            checked={value.avpu === 'Alert'}
                                            onChange={() => handleRadioChange('avpu', 'Alert')}
                                        />
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            inline
                                            type="radio"
                                            label={t('disability.diagnostic.avpu.voice')}
                                            name="avpu"
                                            checked={value.avpu === 'Voice'}
                                            onChange={() => handleRadioChange('avpu', 'Voice')}
                                        />
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            inline
                                            type="radio"
                                            label={t('disability.diagnostic.avpu.pain')}
                                            name="avpu"
                                            checked={value.avpu === 'Pain'}
                                            onChange={() => handleRadioChange('avpu', 'Pain')}
                                        />
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            inline
                                            type="radio"
                                            label={t('disability.diagnostic.avpu.unresponsive')}
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
                                        label={t('disability.diagnostic.dms.label')}
                                        checked={value.dmsExtremitäten || false}
                                        onChange={() => handleMeasureChange('dmsExtremitäten')}
                                    />
                                    {value.dmsExtremitäten && (
                                        <>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label={t('disability.diagnostic.dms.circulation')}
                                                checked={value.durchblutung || false}
                                                onChange={() => handleMeasureChange('durchblutung')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label={t('disability.diagnostic.dms.motion')}
                                                checked={value.motorik || false}
                                                onChange={() => handleMeasureChange('motorik')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label={t('disability.diagnostic.dms.sensation')}
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
                                        label={t('disability.diagnostic.fast.label')}
                                        checked={value.fastProblem || false}
                                        onChange={() => handleMeasureChange('fastProblem')}
                                    />
                                    {value.fastProblem && (
                                        <>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label={t('disability.diagnostic.fast.face')}
                                                checked={value.face || false}
                                                onChange={() => handleMeasureChange('face')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label={t('disability.diagnostic.fast.arms')}
                                                checked={value.arms || false}
                                                onChange={() => handleMeasureChange('arms')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label={t('disability.diagnostic.fast.speech')}
                                                checked={value.speech || false}
                                                onChange={() => handleMeasureChange('speech')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                type="checkbox"
                                                label={t('disability.diagnostic.fast.time.label')}
                                                checked={value.time || false}
                                                onChange={() => handleMeasureChange('time')}
                                                className="mb-3"
                                            />
                                            {value.time && (
                                                <Form.Group className="mb-3">
                                                    <FloatingLabel label={t('disability.diagnostic.fast.time.time')}>
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
                                                <Form.Label>{t('disability.diagnostic.fast.details.label')}</Form.Label>
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
                                        <InputGroup.Text>{t('disability.diagnostic.temperature.label')}</InputGroup.Text>
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
                                            <InputGroup.Text>{t('disability.diagnostic.blood_sugar.label')}</InputGroup.Text>
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
        </Form.Group>
    );
};

export default Disability;
