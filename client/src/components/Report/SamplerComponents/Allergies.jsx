/* eslint-disable react/prop-types */
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Allergies = ({ value, onChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    return (
        <Form.Group className="mb-3">
            <Form.Control
                disabled={disabled}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                as="textarea"
                rows={3}
                placeholder={t('sampler.allergies.placeholder')}
                value={value.text}
                onChange={(e) => onChange('allergies', 'text', e.target.value)}
            />
        </Form.Group>
    );
};

export default Allergies;
