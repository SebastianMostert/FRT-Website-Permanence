/* eslint-disable react/prop-types */
import { Row, Col, Form } from 'react-bootstrap';

const PatientInformation = ({ patientInfo, handlePatientChange }) => {
    return (
        <Form.Group>
            <h5>Patient Information</h5>
            <hr />
            <Row className="mb-3">
                <Col sm={6}>
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter Age"
                        name="age"
                        value={patientInfo.age}
                        onChange={handlePatientChange}
                    />
                </Col>
                <Col sm={6}>
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                        as="select"
                        name="gender"
                        value={patientInfo.gender}
                        onChange={handlePatientChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={6}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter First Name"
                        name="firstName"
                        value={patientInfo.firstName}
                        onChange={handlePatientChange}
                    />
                </Col>
                <Col sm={6}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Last Name"
                        name="lastName"
                        value={patientInfo.lastName}
                        onChange={handlePatientChange}
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={12}>
                    <Form.Label>IAM</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Patient IAM"
                        name="iam"
                        value={patientInfo.iam}
                        onChange={handlePatientChange}
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={12}>
                    <Form.Label>Other Info</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter any other important information"
                        name="otherInfo"
                        value={patientInfo.otherInfo}
                        onChange={handlePatientChange}
                    />
                </Col>
            </Row>
        </Form.Group>
    );
};

export default PatientInformation;
