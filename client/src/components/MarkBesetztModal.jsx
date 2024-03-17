/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getMember } from '../utils';

const MarkBesetztModal = ({ show, handleClose, selectedSlot }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (selectedSlot) {
                const iamList = selectedSlot.IAM.split(', ');

                const users = await Promise.all(
                    iamList.map(async (iam) => {
                        const res = await getMember(iam);
                        if (res.success) {
                            return {
                                IAM: res.data.IAM,
                                firstName: res.data.firstName || 'Unknown',
                                lastName: res.data.lastName || 'User',
                                position: '',
                            };
                        }
                        return null;
                    })
                );

                setSelectedUsers(
                    users
                        .filter((user) => user !== null)
                );

                setLoading(false);
            }
        };

        fetchUsers();
    }, [selectedSlot]);

    const handleSelectPosition = (event, userIAM) => {
        const { value } = event.target;

        setSelectedUsers((prevUsers) =>
            prevUsers.map((user) => (user.IAM === userIAM ? { ...user, position: value } : user))
        );
    };

    const handleMarkBesetzt = () => {
        console.log(selectedUsers);
        if (selectedUsers.length === 0) {
            alert('Please select at least one user to mark as "Besetzt"');
            return;
        }

        // Perform your action here, such as marking the selected users as "Besetzt"
        console.log('Marking users as "Besetzt":', selectedUsers);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Mark as &ldquo;Besetzt&rdquo;</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please select the position for each user:</p>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Form>
                        {selectedUsers.map((user) => (
                            <Form.Group key={user.IAM}>
                                <Form.Check
                                    type="checkbox"
                                    id={user.IAM}
                                    label={`${user.firstName} ${user.lastName}`}
                                    onChange={(e) => handleSelectPosition(e, user.IAM)}
                                />
                                <Form.Control
                                    as="select"
                                    value={user.position}
                                    onChange={(e) => handleSelectPosition(e, user.IAM)}
                                >
                                    <option value="">Select Position</option>
                                    <option value="Chef Agres">Chef Agres</option>
                                    <option value="Equipier Bin.">Equipier Bin.</option>
                                    <option value="Stagiare Bin.">Stagiare Bin.</option>
                                </Form.Control>
                            </Form.Group>
                        ))}
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleMarkBesetzt}>
                    Mark as &ldquo;Besetzt&rdquo;
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MarkBesetztModal;
