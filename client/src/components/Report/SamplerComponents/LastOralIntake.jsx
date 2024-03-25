/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const LastOralIntake = ({ value, onChange, isEditable }) => {
    const [isInputVisible, setIsInputVisible] = useState(value.erhoben || false);

    const disabled = !isEditable;

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setIsInputVisible(isChecked);

        if (!isChecked) {
            onChange('lastOralIntake', 'type', '');
            onChange('lastOralIntake', 'time', '');
            onChange('lastOralIntake', 'details', '');
            onChange('lastOralIntake', 'erhoben', false);
        } else {
            onChange('lastOralIntake', 'erhoben', true);
        }
    };

    const handleInputChange = (field, fieldValue) => {
        onChange('lastOralIntake', field, fieldValue);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Past Medical History</Form.Label>
            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <Form.Check
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="checkbox"
                        label="Erhoben?"
                        checked={isInputVisible}
                        onChange={handleCheckboxChange}
                    />
                </Col>
            </Row>
            {isInputVisible && (
                <>
                    <Row className="align-items-center mt-3">
                        <Col>
                            <Form.Select
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                aria-label="Select Liquid or Solid"
                                value={value.type || ''}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                            >
                                <option value="">Select Liquid or Solid</option>
                                <option value="liquid">Liquid</option>
                                <option value="solid">Solid</option>
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
                        placeholder="Details"
                        value={value.details || ''}
                        onChange={(e) => handleInputChange('details', e.target.value)}
                        className="mt-3"
                    />
                </>
            )}
        </Form.Group>
    );
};

export default LastOralIntake;
