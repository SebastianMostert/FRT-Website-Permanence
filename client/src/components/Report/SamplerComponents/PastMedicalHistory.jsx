/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const PastMedicalHistory = ({ value, onChange }) => {
    const [isHistoryChecked, setIsHistoryChecked] = useState(value.erhoben || false);

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setIsHistoryChecked(isChecked);

        if (!isChecked) {
            onChange('pastMedicalHistory', 'text', '');
            onChange('pastMedicalHistory', 'erhoben', false);
        } else {
            onChange('pastMedicalHistory', 'text', value.text);
            onChange('pastMedicalHistory', 'erhoben', true);
        }
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Past Medical History</Form.Label>
            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <Form.Check
                        type="checkbox"
                        label="Erhoben?"
                        checked={value.erhoben || false}
                        onChange={handleCheckboxChange}
                    />
                </Col>
            </Row>
            {isHistoryChecked && (
                <div>
                    <Form.Label>Past Medical History</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={value.text}
                        onChange={(e) => onChange('pastMedicalHistory', 'text', e.target.value)}
                    />
                </div>
            )}
        </Form.Group>
    );
};

export default PastMedicalHistory;
