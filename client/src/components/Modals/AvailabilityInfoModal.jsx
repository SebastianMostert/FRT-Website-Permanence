import { Button, Modal } from 'react-bootstrap'
import { propTypes } from 'react-bootstrap/esm/Image';

const AvailabilityInfoModal = ({ show, handleClose, selectedAvailability, handleDelete }) => {

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Availability</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this availability ({selectedAvailability?.IAM})?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AvailabilityInfoModal

// React Proptypes
AvailabilityInfoModal.propTypes = {
    show: propTypes.bool.isRequired,
    handleClose: propTypes.func.isRequired,
    selectedAvailability: propTypes.object,
    handleDelete: propTypes.func.isRequired,
};