/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Modal, Button, InputGroup, Form } from 'react-bootstrap'; // Assuming Bootstrap for the modal
import { toast } from 'react-toastify';

const AvailabilityModal = ({ show, handleClose, event, handleDelete, updateAvailability }) => {
    const [editing, setEditing] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [edited, setEdited] = useState(false);

    // Use start date and end date as default values
    useEffect(() => {
        if (!event) return
        const { start, end } = event;

        // Convert start and end dates to Date objects
        const _startDate = new Date(start);
        const _endDate = new Date(end);

        setStartTime(_startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        setEndTime(_endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));

        setStartDate(_startDate);
        setEndDate(_endDate);
    }, [event]);

    if (!event) return null;

    const { title, extendedProps } = event;
    const user = extendedProps.user

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        // Update the event in the database
        if (edited) {
            try {
                const newStartDate = new Date(new Date(startDate).toISOString().split('T')[0] + ' ' + startTime);
                const newEndDate = new Date(new Date(endDate).toISOString().split('T')[0] + ' ' + endTime);

                await updateAvailability(newStartDate, newEndDate, event.id);
            } catch (err) {
                toast.error('An error occured')
            }

            setEdited(false);
            handleClose();
        }

        // Perform save operation here
        setEditing(false);
    };

    const handleChange = (e, type) => {
        try {
            const value = e.target.value;
            setEdited(true);
            if (type === 'start') {
                setStartTime(value);
            } else if (type === 'end') {
                setEndTime(value);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered className='select-none'>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Time Range */}
                <p><strong>Time Range:</strong></p>
                <InputGroup className="mb-3">
                    <Form.Control
                        aria-label="Start Time"
                        type='time'
                        value={startTime}
                        onChange={(e) => handleChange(e, 'start')}
                        style={{
                            cursor: editing ? 'pointer' : 'not-allowed',
                        }}
                        disabled={!editing}
                    />
                    <InputGroup.Text style={{ cursor: editing ? 'pointer' : 'not-allowed' }}>-</InputGroup.Text>
                    <Form.Control
                        aria-label="End Time"
                        type='time'
                        value={endTime}
                        onChange={(e) => handleChange(e, 'end')}
                        style={{
                            cursor: editing ? 'pointer' : 'not-allowed',
                        }}
                        disabled={!editing}
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                {editing ? (
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                ) : (
                    <Button variant="primary" onClick={handleEdit}>
                        Edit
                    </Button>
                )}
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
