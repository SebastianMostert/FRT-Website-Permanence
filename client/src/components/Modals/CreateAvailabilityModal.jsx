/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { formatDate, validateDate } from '../../utils';
import moment from 'moment';
import { useApiClient } from '../../contexts/ApiContext';

const componentTranslationName = 'create_availability_modal';

const CreateAvailabilityModal = ({ show, handleClose, events, currentUser, refreshData, selectedDate }) => {
    const { t } = useTranslation();
    // State for form inputs
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const apiClient = useApiClient();

    useEffect(() => {
        setDate(selectedDate);
    }, [selectedDate]);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleClose();

        // Check if the selected date/time range overlaps with any existing events
        // Works
        const { isValid, event } = validateDate(date, startTime, endTime, events);

        if (isValid) {
            const start = new Date(`${date}T${startTime}`).getTime();
            const end = new Date(`${date}T${endTime}`).getTime();

            try {
                await apiClient.availability.create({
                    IAM: currentUser.IAM,
                    startTime: new Date(`${date}T${startTime}`),
                    endTime: new Date(`${date}T${endTime}`),
                })

                refreshData()
                toast.success(`${t('toast.availability.create.success', { startTime: moment(start).format('HH:mm'), endTime: moment(end).format('HH:mm') })}`)
            } catch (error) {
                console.error(error);
                toast.error(`${t('toast.availability.create.error')}`);
            }
        } else {
            // Display an error message or handle invalid date/time range
            const { extendedProps } = event;
            if (!extendedProps) return;
            const { type } = extendedProps;
            if (!type) return;

            toast.error(`${t(`toast.availability.overlap.${type}`)}`);
        }
    };

    // Current date
    const minDate = new Date();

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-center">{t(`${componentTranslationName}.title`)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="date" className="mb-3">
                        <Form.Label>{t(`${componentTranslationName}.date`)}</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            min={formatDate(minDate)}
                            required
                        />
                    </Form.Group>
                    <Form.Label>{t(`${componentTranslationName}.time_range`)}</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="time"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            required
                            min="08:00"
                            max="18:00"
                        />
                        <Form.Control
                            type="time"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            required
                            min="08:00"
                            max="18:00"
                        />
                    </InputGroup>
                    <div className="d-grid mt-3">
                        <Button variant="success" type="submit">
                            {t('button.create')}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('button.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateAvailabilityModal;

