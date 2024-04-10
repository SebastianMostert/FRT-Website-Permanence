/* eslint-disable react/prop-types */
import { Button, Modal, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const componentTranslationName = 'export_report_modal';

const ExportReportModal = ({ show, onHide, exportType, setExportType, handleExport, handleClose }) => {
    const { t } = useTranslation();

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t(`${componentTranslationName}.title`)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{t(`${componentTranslationName}.description`)}</p>
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
                <Button variant="secondary" onClick={handleClose}>
                    {t('button.close')}
                </Button>
                <Button variant="success" onClick={handleExport}>
                    {t(`${componentTranslationName}.export_as`)} {exportType.toUpperCase()}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ExportReportModal