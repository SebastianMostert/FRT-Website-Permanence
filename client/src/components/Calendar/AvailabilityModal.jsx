/* eslint-disable react/prop-types */
import { Modal, Button } from 'react-bootstrap'; // Assuming Bootstrap for the modal

const AvailabilityModal = ({ show, handleClose, event, handleDelete }) => {
    if (!event) return null; // Return null if event is not defined

    const { title, start, end, extendedProps } = event;
    const user = extendedProps.user

    // Convert start and end dates to string format
    const startDate = new Date(start).toLocaleString();
    const endDate = new Date(end).toLocaleString();

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Start Time:</strong> {startDate}</p>
                <p><strong>End Time:</strong> {endDate}</p>
                {/* Add a line seperator if extendedProps exists */}
                {extendedProps && extendedProps.user && (
                    <>
                        <hr />
                        <p><strong>User:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>Operational Position:</strong> {user.operationalPosition}</p>
                        {/* Add more user details as needed */}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleDelete(event.id, user.IAM, event)}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AvailabilityModal;
