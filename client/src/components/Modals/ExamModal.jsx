/* eslint-disable react/prop-types */
import { Modal, Button, Badge, Row, Col, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ExamModal = ({ show, handleClose, event }) => {
    if (!event) return null;

    const { title, extendedProps } = event;
    let {
        examType,
        name,
        studentClass,
        examDate,
        startTime: _startTime,
        endTime: _endTime,
        subject,
        teachers,
        rooms,
        text,
    } = extendedProps;

    if (_startTime.toString().length === 3) {
        _startTime = '0' + _startTime;
    }
    if (_endTime.toString().length === 3) {
        _endTime = '0' + _endTime;
    }
    const startTime = _startTime.toString().slice(0, 2) + ':' + _startTime.toString().slice(2, 4);
    const endTime = _endTime.toString().slice(0, 2) + ':' + _endTime.toString().slice(2, 4);
    const formattedExamDate = formatExamDate(examDate.toString());

    const handleJustThisExam = () => {
        // Handle just this exam
        toast.error('Removing exams isn\'t supported yet. We are working on it!');
    };

    const handleAllExamsSubject = () => {
        // Handle all exams of this subject
        toast.error('Removing all exams of a given subject isn\'t supported yet. We are working on it!');
    };

    const handleAllExamsTeacher = () => {
        // Handle all exams of this teacher
        toast.error('Removing all exams of a given teacher isn\'t supported yet. We are working on it!');
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <p><strong><Badge variant="info">Time Span:</Badge></strong> {startTime} - {endTime}</p>
                        <p><strong><Badge variant="info">Date:</Badge></strong> {formattedExamDate}</p>
                        <p><strong><Badge variant="info">Teacher IAM:</Badge></strong> {teachers.join(', ')}</p>
                        <p><strong><Badge variant="info">Exam Type:</Badge></strong> {examType}</p>
                        <p><strong><Badge variant="info">Subject:</Badge></strong> {subject}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong><Badge variant="info">Class(es):</Badge></strong> {studentClass.join(', ')}</p>
                        <p><strong><Badge variant="info">Room(s):</Badge></strong> {rooms.join(', ')}</p>
                        <p><strong><Badge variant="info">Name:</Badge></strong> {name}</p>
                        <p><strong><Badge variant="info">Exam Date:</Badge></strong> {examDate}</p>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <p><strong><Badge variant="info">Description:</Badge></strong></p>
                        <p>{text}</p>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Dropdown>
                    <Dropdown.Toggle variant="danger" id="dropdown-hide-exam">
                        Remove Exam
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleJustThisExam}>Just this exam</Dropdown.Item>
                        <Dropdown.Item onClick={handleAllExamsSubject}>All exams of this subject</Dropdown.Item>
                        <Dropdown.Item onClick={handleAllExamsTeacher}>All exams of this teacher</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ExamModal;

const formatExamDate = (examDate) => {
    const year = examDate.slice(0, 4);
    const month = examDate.slice(4, 6);
    const day = examDate.slice(6, 8);

    const formattedDate = new Date(`${year}-${month}-${day}`);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedString = formattedDate.toLocaleDateString(undefined, options);

    return formattedString;
};
