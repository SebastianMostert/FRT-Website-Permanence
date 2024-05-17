/* eslint-disable react/prop-types */
import { Form, Card } from 'react-bootstrap';
import BodyDiagram from './BodyDiagram';
import { useTranslation } from 'react-i18next';

const ExposureEnvironment = ({ value = {}, onChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

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
            <div>
                <Card className="mb-3">
                    <Card.Body>
                        <Form.Label>{t('abcde.category.diagnostic')}</Form.Label>
                        <hr />
                        <Form.Group className="mb-3">
                            <Form.Label>{t('exposure_environment.diagnostic.pain_scale')} {value.schmerzskala || 0}/10</Form.Label>
                            <Form.Range
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                type="range"
                                min={0}
                                max={10}
                                step={1}
                                value={value.schmerzskala || 0}
                                onChange={handleRangeChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                type="checkbox"
                                label={t('exposure_environment.diagnostic.body_check')}
                                checked={value.bodycheck || false}
                                onChange={() => handleMeasureChange('bodycheck')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('exposure_environment.diagnostic.further_injuries')}</Form.Label>
                            <Form.Control
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                as="textarea"
                                rows={3}
                                value={value.weitereVerletzungen || ''}
                                onChange={(e) => handleInputChange('weitereVerletzungen', e.target.value)}
                            />
                        </Form.Group>
                        <BodyDiagram value={value} onChange={onChange} isEditable={isEditable} />
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Form.Label>{t('abcde.category.measures')}</Form.Label>
                        <hr />
                        <Form.Group className="mb-3">
                            <Form.Check
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                type="checkbox"
                                label={t('exposure_environment.measures.heat_retention')}
                                checked={value.wärmeerhalt || false}
                                onChange={() => handleMeasureChange('wärmeerhalt')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                type="checkbox"
                                label={t('exposure_environment.measures.wound_care')}
                                checked={value.wundversorgung || false}
                                onChange={() => handleMeasureChange('wundversorgung')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                type="checkbox"
                                label={t('exposure_environment.measures.limb_splinting')}
                                checked={value.extremitätenschienung || false}
                                onChange={() => handleMeasureChange('extremitätenschienung')}
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>
            </div>
        </Form.Group>
    );
};

export default ExposureEnvironment;
