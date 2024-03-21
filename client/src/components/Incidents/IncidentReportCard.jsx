/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button, Card, Accordion, Modal, Badge } from 'react-bootstrap';

const IncidentReportCard = ({ missionNumber, onEdit, onDelete, onExportPDF, onArchive, users, currentUser }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEdit = () => {
        onEdit();
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete();
        setShowDeleteModal(false);
    };

    const handleExportPDF = () => {
        onExportPDF();
    };

    const handleArchive = () => {
        onArchive();
    };

    const extractMissionInfo = () => {
        const year = missionNumber.substring(0, 4);
        const month = missionNumber.substring(4, 6);
        const day = missionNumber.substring(6, 8);
        const incidentNumber = missionNumber.substring(8);

        return {
            year,
            month,
            day,
            incidentNumber,
        };
    };

    const missionInfo = extractMissionInfo();

    // Check if the current user is one of the First Responders
    const isCurrentUserFirstResponder = users.some(user => user.IAM === currentUser.IAM);

    return (
        <Card className="custom-card mb-4">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="card-subtitle mb-2 text-muted">Mission Date</div>
                        <div className="card-title">{`${missionInfo.year}-${missionInfo.month}-${missionInfo.day}`}</div>
                    </div>
                    <div>
                        <div className="card-subtitle mb-2 text-muted">Incident</div>
                        <div className="card-title">#{missionInfo.incidentNumber}</div>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="card-subtitle mb-2 text-muted">First Responders</div>
                    <Accordion>
                        {users.map((user, index) => (
                            <Accordion.Item key={index} eventKey={index.toString()}>
                                <Accordion.Header>
                                    {`${user.firstName} ${user.lastName}`}
                                    <span className="ms-2 text-muted">{user.position}</span>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div>
                                        <strong>Email:</strong> {user.email}
                                    </div>
                                    <div>
                                        <strong>Student Class:</strong> {user.studentClass}
                                    </div>
                                    {/* Add more user details here as needed */}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>

                <div className="text-center mt-4">
                    {isCurrentUserFirstResponder ? (
                        <Button variant="primary" onClick={handleEdit} className="me-2">Edit</Button>
                    ) : (
                        <Button variant="info" onClick={handleEdit} className="me-2">View</Button>
                    )}
                    <Button variant="danger" onClick={handleDelete} className="me-2">Delete</Button>
                    <Button variant="success" onClick={handleExportPDF} className="me-2">Export as PDF</Button>
                    <Button variant="info" onClick={handleArchive}>Archive</Button>
                </div>
            </Card.Body>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="custom-modal" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this report?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default IncidentReportCard;
