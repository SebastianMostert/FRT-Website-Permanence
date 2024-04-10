/* eslint-disable react/prop-types */
import { Form, Row, Col, Card, Container, FloatingLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CriticalBleeding = ({ value = {}, onChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    const handleMeasureChange = (measure) => {
        onChange('criticalBleeding', measure, !value[measure]);
    };

    return (
        <Form.Group className="mb-3">
            <Card body>
                <Container>
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Form.Label>{t('abcde.category.measures')}</Form.Label>
                                    <hr />
                                    <Form.Check
                                        disabled={disabled}
                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                        type="checkbox"
                                        label={t('critical_bleeding.measure.tourniquet')}
                                        checked={value.tourniquet || false}
                                        onChange={() => handleMeasureChange('tourniquet')}
                                    />
                                    {value.tourniquet && (
                                        <Form.Group >
                                            <FloatingLabel label={t('critical_bleeding.measure.tourniquet.time')}>
                                                <Form.Control
                                                    disabled={disabled}
                                                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                    type="time"
                                                    value={value.tourniquetTime || ''}
                                                    onChange={(e) =>
                                                        onChange('criticalBleeding', 'tourniquetTime', e.target.value)
                                                    }
                                                    required={value.tourniquet}
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    )}
                                    <Form.Check
                                        disabled={disabled}
                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                        type="checkbox"
                                        label={t('critical_bleeding.measure.manual_compression')}
                                        checked={value.manualCompression || false}
                                        onChange={() => handleMeasureChange('manualCompression')}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Card>
        </Form.Group>
    );
};

export default CriticalBleeding;
