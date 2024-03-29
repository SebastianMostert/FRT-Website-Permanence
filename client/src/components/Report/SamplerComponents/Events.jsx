/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const Events = ({ value, onChange, isEditable }) => {
  const [isEventsChecked, setIsEventsChecked] = useState(value.erhoben || false);

  const disabled = !isEditable;

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setIsEventsChecked(isChecked);

    if (!isChecked) {
      onChange('events', 'text', '');
      onChange('events', 'erhoben', false);
    } else {
      onChange('events', 'erhoben', true);
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
            checked={isEventsChecked}
            onChange={handleCheckboxChange}
          />
        </Col>
      </Row>
      {isEventsChecked && (
        <Form.Control
          disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          as="textarea"
          rows={3}
          placeholder="Events"
          value={value.text}
          onChange={(e) => onChange('events', 'text', e.target.value)}
          className="mt-3"
        />
      )}
    </Form.Group>
  );
};

export default Events;
