/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const Medications = ({ value, onChange }) => {
  const [medicineList, setMedicineList] = useState(value.text || '');
  const [medicineListImage, setMedicineListImage] = useState(value.medicineListImage || null);
  const [showImageInput, setShowImageInput] = useState(value.medicineHasImage || false);
  const [isHistoryChecked, setIsHistoryChecked] = useState(value.erhoben || false);

  const handleErhobenChange = (event) => {
      const isChecked = event.target.checked;
      setIsHistoryChecked(isChecked);

      if (!isChecked) {
          onChange('medications', 'text', '');
          onChange('medications', 'erhoben', false);
      } else {
          onChange('medications', 'text', value.text);
          onChange('medications', 'erhoben', true);
      }
  };

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
      <Form.Label>Medications</Form.Label>
      <Row className="mb-3 align-items-center">
        <Col xs="auto">
          <Form.Check
            type="checkbox"
            label="Erhoben?"
            checked={value.erhoben || false}
            onChange={handleErhobenChange}
          />
        </Col>
      </Row>
      {isHistoryChecked && (
        <div>
          <Form.Group className="mb-3">
            <Form.Label>Medications List</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={medicineList}
              onChange={handleMedicineListChange}
            />
            <Row className="mt-3">
              <Col>
                <Form.Check
                  type="checkbox"
                  label="Image of Medication Added?"
                  checked={showImageInput}
                  onChange={handleCheckboxChange}
                />
                {showImageInput && (
                  <div>
                    <Form.Label>Upload Picture of Medicine List</Form.Label>
                    <Form.Control
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
        </div >
      )}
    </Form.Group>
  );
};

export default Medications;
