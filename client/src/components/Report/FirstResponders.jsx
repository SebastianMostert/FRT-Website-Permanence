/* eslint-disable react/prop-types */
import { Row, Col, Form } from 'react-bootstrap';

const FirstResponders = ({ firstResponders, handleResponderChange }) => {
    return (
        <Form.Group>
            <h5>First Responders Information</h5>
            <hr />
            {firstResponders.map((responder, index) => (
                <Row key={index} className="mb-3">
                    <Col sm={8} className="mx-auto">
                        <Form.Label>{responder.position}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter IAM"
                            value={responder.iam}
                            onChange={(e) => handleResponderChange(index, e)}
                        />
                    </Col>
                </Row>
            ))}
        </Form.Group>
    );
};

export default FirstResponders;
