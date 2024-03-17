/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const Allergies = ({ value, onChange }) => {
    const [isAllergiesChecked, setIsAllergiesChecked] = useState(value.erhoben || false);

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setIsAllergiesChecked(isChecked);

        if (!isChecked) {
            onChange('allergies', 'text', '');
            onChange('allergies', 'erhoben', false);
        } else {
            onChange('allergies', 'text', value.text);
            onChange('allergies', 'erhoben', true);
        }
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Allergies</Form.Label>
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
            {isAllergiesChecked && (
                <div>
                    <Form.Label>Allergies</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={value.text}
                        onChange={(e) => onChange('allergies', 'text', e.target.value)}
                    />
                </div>
            )}
        </Form.Group>
    );
};

export default Allergies;
