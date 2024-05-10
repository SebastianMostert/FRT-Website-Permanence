/* eslint-disable react/prop-types */
import { Modal, Button, Badge, Row, Col, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useApiClient } from '../../contexts/ApiContext';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const componentTranslationName = 'exam_modal';

const ExamModal = ({ show, handleClose, event, refreshData }) => {
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user);
    const apiClient = useApiClient();

    if (!event) return null;

    const { extendedProps } = event;
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

    const handleJustThisExam = async () => {
        // Handle just this exam
        try {
            await apiClient.exam.removeExam({
                exam: {
                    _endTime,
                    _startTime,
                    examDate,
                }, IAM: currentUser.IAM
            });
            refreshData();
            handleClose();
        } catch (err) {
            console.log(err);
            toast.error('An error occured');
        }

    };

    const handleAllExamsSubject = async () => {
        // Handle all exams of this subject
        await apiClient.exam.removeSubject({ subject, IAM: currentUser.IAM });
        refreshData();
        handleClose();
    };

    const handleAllExamsTeacher = async () => {
        // Handle all exams of this teacher
        for (let i = 0; i < teachers.length; i++) {
            const teacher = teachers[i];
            await apiClient.exam.removeTeacher({ teacher, IAM: currentUser.IAM });
        }
        refreshData();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t(`${componentTranslationName}.title`)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.time_span`)}</Badge></strong> {startTime} - {endTime}</p>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.date`)}</Badge></strong> {formattedExamDate}</p>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.teacher_iam`)}</Badge></strong> {teachers.join(', ')}</p>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.exam_type`)}</Badge></strong> {examType}</p>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.subject`)}</Badge></strong> {subject}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.classes`)}</Badge></strong> {studentClass.join(', ')}</p>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.rooms`)}</Badge></strong> {rooms.join(', ')}</p>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.name`)}</Badge></strong> {name}</p>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.exam_date`)}</Badge></strong> {examDate}</p>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <p><strong><Badge variant="info">{t(`${componentTranslationName}.description`)}</Badge></strong></p>
                        <p>{text}</p>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Dropdown>
                    <Dropdown.Toggle variant="danger" id="dropdown-hide-exam">
                        {t(`${componentTranslationName}.remove_exam.label`)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleJustThisExam}>{t(`${componentTranslationName}.remove_exam.just_this`)}</Dropdown.Item>
                        <Dropdown.Item onClick={handleAllExamsSubject}>{t(`${componentTranslationName}.remove_exam.subject`)}</Dropdown.Item>
                        <Dropdown.Item onClick={handleAllExamsTeacher}>{t(`${componentTranslationName}.remove_exam.teacher`)}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant="secondary" onClick={handleClose}>
                    {t('button.close')}
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
