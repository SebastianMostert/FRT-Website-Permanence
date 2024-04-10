/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Medications = ({ value, onChange, isEditable }) => {
  const { t } = useTranslation();
  const [medicineList, setMedicineList] = useState(value.text || '');
  const [medicineListImage, setMedicineListImage] = useState(value.medicineListImage || null);
  const [showImageInput, setShowImageInput] = useState(value.medicineHasImage || false);
  const disabled = !isEditable;


  const handleMedicineListChange = (event) => {
    const newValue = event.target.value;
    setMedicineList(newValue);
    onChange('medications', 'text', newValue);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMedicineListImage(reader.result);
      onChange('medications', 'medicineListImage', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setShowImageInput(isChecked);
    onChange('medications', 'medicineHasImage', isChecked);
    if (!isChecked) {
      setMedicineListImage(null);
      onChange('medications', 'medicineListImage', null);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Group className="mb-3">
        <Form.Control
          disabled={disabled}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          as="textarea"
          rows={3}
          value={medicineList}
          onChange={handleMedicineListChange}
          placeholder={t('sampler.medications.placeholder')}
        />
        <Row className="mt-3">
          <Col>
            <Form.Check
              disabled={disabled}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
              type="checkbox"
              label={t('sampler.medications.image.label')}
              checked={showImageInput}
              onChange={handleCheckboxChange}
            />
            {showImageInput && (
              <div>
                <Form.Label>{t('sampler.medications.image.description')}</Form.Label>
                <Form.Control
                  disabled={disabled}
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </Col>
          <Col>
            {medicineListImage && (
              <div className="mt-3">
                <img
                  src={medicineListImage}
                  alt="Medicine List"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </div>
            )}
          </Col>
        </Row>
      </Form.Group>
    </Form.Group>
  );
};

export default Medications;
