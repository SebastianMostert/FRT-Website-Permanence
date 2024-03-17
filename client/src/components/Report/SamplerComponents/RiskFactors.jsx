/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const RiskFactors = ({ value, onChange }) => {
    const [isRiskFactorsChecked, setIsRiskFactorsChecked] = useState(value.erhoben || false);

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
                        type="checkbox"
                        label="Erhoben?"
                        checked={isRiskFactorsChecked}
                        onChange={handleCheckboxChange}
                    />
                </Col>
            </Row>
            {isRiskFactorsChecked && (
                <Form.Control
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
