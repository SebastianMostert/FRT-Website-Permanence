/* eslint-disable react/prop-types */
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const DeleteShiftModal = ({ show, handleClose, shift, handleDeleteShift }) => {
    const { t } = useTranslation();
    const componentTranslationName = 'exam_modal';

    if (!shift) return null;

    const { _id, startDate, endDate, title, users } = shift;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t(`${componentTranslationName}.title`)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{t(`${componentTranslationName}.description`)}</p>
                <p><strong>Start Date:</strong> {startDate}</p>
                <p><strong>End Date:</strong> {endDate}</p>
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Users:</strong></p>
                {users && users.map((user, index) => (
                    <p key={index}>{user.firstName[0].toUpperCase()}. {user.lastName} - {user.position}</p> 
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('button.close')}
                </Button>
                <Button variant="danger" onClick={() => handleDeleteShift(_id)}>
                    {t('button.delete')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteShiftModal;
