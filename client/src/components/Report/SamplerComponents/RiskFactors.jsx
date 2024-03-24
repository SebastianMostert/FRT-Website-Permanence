/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const RiskFactors = ({ value, onChange, isEditable }) => {
    const [isRiskFactorsChecked, setIsRiskFactorsChecked] = useState(value.erhoben || false);

    const disabled = !isEditable;

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setIsRiskFactorsChecked(isChecked);

        if (!isChecked) {
            onChange('riskFactors', 'text', '');
            onChange('riskFactors', 'erhoben', false);
        } else {
            onChange('riskFactors', 'erhoben', true);
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
                        checked={isRiskFactorsChecked}
                        onChange={handleCheckboxChange}
                    />
                </Col>
            </Row>
            {isRiskFactorsChecked && (
                <Form.Control
                    disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                    as="textarea"
                    rows={3}
                    placeholder="Risk Factors"
                    value={value.text}
                    onChange={(e) => onChange('riskFactors', 'text', e.target.value)}
                    className="mt-3"
                />
            )}
        </Form.Group>
    );
};

export default RiskFactors;
