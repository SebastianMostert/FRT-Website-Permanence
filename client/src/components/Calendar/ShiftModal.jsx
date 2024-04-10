/* eslint-disable react/prop-types */
import { Modal, Button } from 'react-bootstrap'; // Assuming Bootstrap for the modal

const ShiftModal = ({ show, handleClose, event }) => {
    if (!event) return null; // Return null if event is not defined

    const { title, start, end, extendedProps } = event;
    const users = extendedProps.users

    // Convert start and end dates to string format
    const startDate = new Date(start).toLocaleString();
    const endDate = new Date(end).toLocaleString();

    const hasUsers = extendedProps && users && users.length > 0;

    // Now get the users
    const userList = hasUsers ? (
        users.map(user => (
            <>
                <hr />
                <p><strong>User:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Position:</strong> {user.position}</p>
                {/* Add more user details as needed */}
            </>
        ))
    ) : (
        <p>The shift has no valid users.</p>
    );

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Start Time:</strong> {startDate}</p>
                <p><strong>End Time:</strong> {endDate}</p>
                {/* Add a line seperator if extendedProps exists */}
                {userList}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ShiftModal;
