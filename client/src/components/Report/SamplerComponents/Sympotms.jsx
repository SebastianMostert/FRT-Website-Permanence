/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const Symptoms = ({ value, onChange, isEditable }) => {
    const [isSymptomsChecked, setIsSymptomsChecked] = useState(value.erhoben || false);

    const disabled = !isEditable;

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setIsSymptomsChecked(isChecked);

        if (!isChecked) {
            onChange('symptoms', 'text', '');
            onChange('symptoms', 'erhoben', false);
        } else {
            onChange('symptoms', 'text', value.text);
            onChange('symptoms', 'erhoben', true);
        }
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Symptoms</Form.Label>
            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <Form.Check
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="checkbox"
                        label="Erhoben?"
                        checked={value.erhoben || false}
                        onChange={handleCheckboxChange}
                    />
                </Col>
            </Row>
            {isSymptomsChecked && (
                <div>
                    <Form.Label>Symptoms</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        as="textarea"
                        rows={3}
                        value={value.text}
                        onChange={(e) => onChange('symptoms', 'text', e.target.value)}
                    />
                </div>
            )}
        </Form.Group>
    );
};

export default Symptoms;
