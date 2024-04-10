/* eslint-disable react/prop-types */
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LastOralIntake = ({ value, onChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    const handleInputChange = (field, fieldValue) => {
        onChange('lastOralIntake', field, fieldValue);
    };

    return (
        <Form.Group className="mb-3">
            <Row className="align-items-center mt-3">
                <Col>
                    <Form.Select
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        value={value.type || ''}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                        <option value="">{t('sampler.last_oral_intake.select.label')}</option>
                        <option value="liquid">{t('sampler.last_oral_intake.select.liquid')}</option>
                        <option value="solid">{t('sampler.last_oral_intake.select.solid')}</option>
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="time"
                        value={value.time || ''}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                    />
                </Col>
            </Row>
            <Form.Control
                disabled={disabled}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                as="textarea"
                rows={3}
                placeholder={t('sampler.last_oral_intake.placeholder')}
                value={value.details || ''}
                onChange={(e) => handleInputChange('details', e.target.value)}
                className="mt-3"
            />
        </Form.Group>
    );
};

export default LastOralIntake;
