/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Button, Card, Accordion, ButtonGroup, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ExportReportModal from '../Modals/ExportReportModal';
import { LoadingPage } from '../../pages';
import { getRoles } from '../../utils';

const IncidentReportCard = ({
    report,
    onEdit,
    onExport,
    onArchive,
    currentUser,
}) => {
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportType, setExportType] = useState('pdf');
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const { t } = useTranslation();

    const missionNumber = report.missionNumber.toString();
    const archived = report.archived;
    const users = report.users;


    const handleExport = () => {
        onExport(report, exportType);
        setShowExportModal(false);
    };

    const handleArchive = () => onArchive();
    const handleUnarchive = () => onArchive();
    const handleEdit = () => onEdit();

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

    useEffect(() => {
        async function fetchData() {
            const roles = await getRoles(currentUser?.IAM);
            setRoles(roles);
            setLoading(false);
        }

        fetchData();
    }, [currentUser?.IAM]);

    useEffect(() => {
        // Check if the current user is one of the First Responders
        const isCurrentUserFirstResponder = users.some(user => user.IAM === currentUser.IAM);
        // Check if the incident is from today
        const isToday = new Date().toLocaleDateString() === `${missionInfo.day}/${missionInfo.month}/${missionInfo.year}`;
        // Check if the user is an admin
        const isAdmin = roles.includes('admin');

        if (missionNumber.length === 10 && isToday && (isCurrentUserFirstResponder || isAdmin)) setIsEditable(true);
        else setIsEditable(false);
    }, [currentUser.IAM, missionInfo.day, missionInfo.month, missionInfo.year, missionNumber.length, roles, users]);

    if (loading) {
        return <LoadingPage />
    }

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="card-subtitle mb-2 text-muted">{t('incidents.mission_date')}</div>
                        <div className="card-title">{`${missionInfo.year}-${missionInfo.month}-${missionInfo.day}`}</div>
                    </div>
                    <div>
                        <div className="card-subtitle mb-2 text-muted">{t('incidents.incident_number')}</div>
                        <div className="card-title">#{missionInfo.incidentNumber}</div>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="card-subtitle mb-2 text-muted">{t('incidents.responders')}</div>
                    <Accordion>
                        {users.map((user, index) => (
                            <UserAccordion
                                key={index}
                                user={user}
                                index={index}
                                t={t}
                            />
                        ))
                        }
                    </Accordion>
                </div>

                <div className="text-center mt-4">
                    <InputGroup>
                    </InputGroup>
                    {isEditable ? (
                        <Button variant="primary" onClick={handleEdit} className="me-2">
                            {t('incidents.button.edit')}
                        </Button>
                    ) : (
                        <Button variant="info" onClick={handleEdit} className="me-2">
                            {t('incidents.button.view')}
                        </Button>
                    )}

                    <ButtonGroup className="me-2">
                        <Button variant="success" onClick={() => setShowExportModal(true)}>
                            {t('incidents.button.export')}
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
                            {t('incidents.button.unarchive')}
                        </Button>
                    ) : (
                        <Button variant="info" onClick={handleArchive}>
                            {t('incidents.button.archive')}
                        </Button>
                    )}
                </div>
            </Card.Body>

            <ExportReportModal
                exportType={exportType}
                show={showExportModal}
                onHide={() => setShowExportModal(false)}
                handleExport={handleExport}
                setExportType={setExportType}
                handleClose={() => setShowExportModal(false)}
            />
        </Card>
    );
};

export default IncidentReportCard;

const UserAccordion = ({ user, index, t }) => {
    return (
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
                    <strong>{t('incidents.student_class')}</strong> {user.studentClass}
                </div>
                {/* Add more user details here as needed */}
            </Accordion.Body>
        </Accordion.Item>
    );
}