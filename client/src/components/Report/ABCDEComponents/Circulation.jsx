/* eslint-disable react/prop-types */
import { Form, Row, Col, Card, Container, FloatingLabel, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Circulation = ({ value = {}, onChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

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
            <Card body>
                <Container>
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Form.Label>{t('abcde.category.diagnostic')}</Form.Label>
                                    <hr />
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t('circulation.diagnostic.pulse.regularity.label')}</Form.Label>
                                        <div>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.pulse.regularity.regular')}
                                                name="pulsRegelmäßig"
                                                checked={value.pulsRegelmäßig === 'Regelmäßig'}
                                                onChange={() => handleRadioChange('pulsRegelmäßig', 'Regelmäßig')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.pulse.regularity.irregular')}
                                                name="pulsRegelmäßig"
                                                checked={value.pulsRegelmäßig === 'Unregelmäßig'}
                                                onChange={() => handleRadioChange('pulsRegelmäßig', 'Unregelmäßig')}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t('circulation.diagnostic.pulse.palpable.label')}</Form.Label>
                                        <div>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.pulse.palpable.good')}
                                                name="pulsTastbar"
                                                checked={value.pulsTastbar === 'Gut tastbar'}
                                                onChange={() => handleRadioChange('pulsTastbar', 'Gut tastbar')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.pulse.palpable.poor')}
                                                name="pulsTastbar"
                                                checked={value.pulsTastbar === 'Schlecht tastbar'}
                                                onChange={() => handleRadioChange('pulsTastbar', 'Schlecht tastbar')}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <InputGroup>
                                                <Form.Control
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="number"
                                                    value={value.bpm || ''}
                                                    onChange={(e) => handleInputChange('bpm', e.target.value)}
                                                    className="ml-2"
                                                />
                                                <InputGroup.Text>BPM</InputGroup.Text>
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
                                        <Form.Label className="me-2">{t('circulation.diagnostic.abdomen.label')}</Form.Label>
                                        <div>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.abdomen.soft')}
                                                name="abdomen"
                                                checked={value.abdomen === 'Weich'}
                                                onChange={() => handleRadioChange('abdomen', 'Weich')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.abdomen.hard')}
                                                name="abdomen"
                                                checked={value.abdomen === 'Hart'}
                                                onChange={() => handleRadioChange('abdomen', 'Hart')}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex align-items-center">
                                        <Form.Label className="me-2">{t('circulation.diagnostic.pelvis.label')}</Form.Label>
                                        <div>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.pelvis.stable')}
                                                name="becken"
                                                checked={value.becken === 'Stabil'}
                                                onChange={() => handleRadioChange('becken', 'Stabil')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.pelvis.unstable')}
                                                name="becken"
                                                checked={value.becken === 'Instabil'}
                                                onChange={() => handleRadioChange('becken', 'Instabil')}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex align-items-center">
                                        <Form.Label className="me-2">{t('circulation.diagnostic.thigh.label')}</Form.Label>
                                        <div>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.thigh.stable')}
                                                name="oberschenkel"
                                                checked={value.oberschenkel === 'Stabil'}
                                                onChange={() => handleRadioChange('oberschenkel', 'Stabil')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('circulation.diagnostic.thigh.unstable')}
                                                name="oberschenkel"
                                                checked={value.oberschenkel === 'Instabil'}
                                                onChange={() => handleRadioChange('oberschenkel', 'Instabil')}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t('circulation.diagnostic.ecg_image.label')}</Form.Label>
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
                                    <Form.Label>{t('abcde.category.measures')}</Form.Label>
                                    <hr />
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('circulation.measures.flat_positioning')}
                                            checked={value.flachlagerung || false}
                                            onChange={() => handleMeasureChange('flachlagerung')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('circulation.measures.shock_positioning')}
                                            checked={value.schocklagerung || false}
                                            onChange={() => handleMeasureChange('schocklagerung')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('circulation.measures.recovery_position')}
                                            checked={value.stabileSeitenlage || false}
                                            onChange={() => handleMeasureChange('stabileSeitenlage')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('circulation.measures.pressure_bandage')}
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
        </Form.Group>
    );
};

export default Circulation;
