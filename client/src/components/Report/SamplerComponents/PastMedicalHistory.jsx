/* eslint-disable react/prop-types */
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PastMedicalHistory = ({ value, onChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    return (
        <Form.Group className="mb-3">
            <Form.Control
                disabled={disabled}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                as="textarea"
                placeholder={t('sampler.past_medical_history.placeholder')}
                rows={3}
                value={value.text}
                onChange={(e) => onChange('pastMedicalHistory', 'text', e.target.value)}
            />
        </Form.Group>
    );
};

export default PastMedicalHistory;
