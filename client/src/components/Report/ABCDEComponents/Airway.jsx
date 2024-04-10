/* eslint-disable react/prop-types */
import { Form, Row, Col, Card, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Airway = ({ value = {}, onChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    const handleMeasureChange = (measure) => {
        onChange('airway', measure, !value[measure]);
    };

    return (
        <Form.Group className="mb-3">
            <Card body>
                <Row>
                    <Col>
                        <Container>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Form.Label>{t('abcde.category.diagnostic')}</Form.Label>
                                    <hr />
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t('airway.diagnostic.state.label')}</Form.Label>
                                        <Form.Control
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            as="select"
                                            value={value.airway || ''}
                                            onChange={(e) => onChange('airway', 'airway', e.target.value)}
                                        >
                                            <option value="">{t('airway.diagnostic.state.select')}</option>
                                            <option value="Free">{t('airway.diagnostic.state.free')}</option>
                                            <option value="Obstructed">{t('airway.diagnostic.state.obstructed')}</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('airway.diagnostic.cervical_spine_trauma')}
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
                                    <Form.Label>{t('abcde.category.measures')}</Form.Label>
                                    <hr />
                                    <Form.Check
                                        disabled={disabled}
                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                        type="checkbox"
                                        label={t('airway.measures.esmarch')}
                                        checked={value.esmarch || false}
                                        onChange={() => handleMeasureChange('esmarch')}
                                    />
                                    <Form.Check
                                        disabled={disabled}
                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                        type="checkbox"
                                        label={t('airway.measures.guedel')}
                                        checked={value.guedel || false}
                                        onChange={() => handleMeasureChange('guedel')}
                                    />
                                    <Form.Check
                                        disabled={disabled}
                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                        type="checkbox"
                                        label={t('airway.measures.wendl')}
                                        checked={value.wendl || false}
                                        onChange={() => handleMeasureChange('wendl')}
                                    />
                                    <Form.Check
                                        disabled={disabled}
                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                        type="checkbox"
                                        label={t('airway.measures.suction_manual')}
                                        checked={value.absaugen || false}
                                        onChange={() => handleMeasureChange('absaugen')}
                                    />
                                    <Form.Check
                                        disabled={disabled}
                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                        type="checkbox"
                                        label={t('airway.measures.stifneck')}
                                        checked={value.stiffneck || false}
                                        onChange={() => handleMeasureChange('stiffneck')}
                                    />
                                </Card.Body>
                            </Card>
                        </Container>
                    </Col>
                </Row>
            </Card>
        </Form.Group>
    );
};

export default Airway;
