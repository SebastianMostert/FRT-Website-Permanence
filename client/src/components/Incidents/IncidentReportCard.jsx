/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button, Card, Accordion, Modal, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';

const IncidentReportCard = ({
    report,
    onEdit,
    onExport,
    onArchive,
    currentUser,
}) => {
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportType, setExportType] = useState('pdf');

    const missionNumber = report.missionNumber.toString();
    const archived = report.archived;
    const users = report.users;

    const handleEdit = () => {
        onEdit();
    };

    const handleExport = () => {
        onExport(report, exportType);
        setShowExportModal(false);
    };

    const handleArchive = () => {
        onArchive();
    };

    const handleUnarchive = () => {
        // Call the onArchive function, as it's the same function to toggle archive/unarchive
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
    
    // Check if the incident is from today
    const isToday = new Date().toLocaleDateString() === `${missionInfo.day}/${missionInfo.month}/${missionInfo.year}`;

    const isEditable = !archived && isCurrentUserFirstResponder && isToday;

    return (
        <Card>
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
                    {isEditable ? (
                        <Button variant="primary" onClick={handleEdit} className="me-2">
                            Edit
                        </Button>
                    ) : (
                        <Button variant="info" onClick={handleEdit} className="me-2">
                            View
                        </Button>
                    )}

                    <ButtonGroup className="me-2">
                        <Button variant="success" onClick={() => setShowExportModal(true)}>
                            Export
                        </Button>
                        <DropdownButton
                            as={ButtonGroup}
                            title=""
                            id="bg-nested-dropdown"
                            variant="success"
                            align="end"
                        >
                            <Dropdown.Item onClick={() => { setExportType('pdf'); setShowExportModal(true); }}>PDF</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setExportType('csv'); setShowExportModal(true); }}>CSV</Dropdown.Item>
                        </DropdownButton>
                    </ButtonGroup>

                    {archived ? (
                        <Button variant="info" onClick={handleUnarchive}>
                            Unarchive
                        </Button>
                    ) : (
                        <Button variant="info" onClick={handleArchive}>
                            Archive
                        </Button>
                    )}
                </div>
            </Card.Body>

            <Modal show={showExportModal} onHide={() => setShowExportModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select Export Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Choose the export format:</p>
                    <ButtonGroup>
                        <Button
                            variant={exportType === 'pdf' ? 'primary' : 'outline-primary'}
                            onClick={() => setExportType('pdf')}
                        >
                            PDF
                        </Button>
                        <Button
                            variant={exportType === 'csv' ? 'primary' : 'outline-primary'}
                            onClick={() => setExportType('csv')}
                        >
                            CSV
                        </Button>
                    </ButtonGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExportModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleExport}>
                        Export as {exportType.toUpperCase()}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default IncidentReportCard;