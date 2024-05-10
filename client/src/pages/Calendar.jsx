import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { colors, formatDate, getMember, validateDate, verifyClass } from '../utils';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../Styles/CustomCalendar.css'; // Import your custom CSS stylesheet

import CalendarComponent from '../components/Calendar/Calendar';
import { useTranslation } from 'react-i18next';
import AvailabilityModal from '../components/Calendar/AvailabilityModal';
import CreateAvailabilityModal from '../components/Modals/CreateAvailabilityModal';
import ShiftModal from '../components/Calendar/ShiftModal';
import ExamModal from '../components/Modals/ExamModal';

import { NoMobilePage, NotAuthorized } from './index'
import { useApiClient } from '../contexts/ApiContext';
import moment from 'moment';

const VIEW_TYPE_KEY = 'viewType';
const EXAM_TYPE = 'exam';
const AVAILABILITY_TYPE = 'availability';
const SHIFT_TYPE = 'shift';

export default function Calendar() {
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user)
    const toastIdLoading = useRef(null);
    const toastIdRefreshing = useRef(null);
    const IAM = currentUser.IAM;

    const [calendarEvent, setCalendarEvent] = useState([]);
    const [calendarAvailability, setCalendarAvailability] = useState([]);
    const [calendarShift, setCalendarShift] = useState([]);

    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [showShiftModal, setShowShiftModal] = useState(false);

    const [showExamModal, setShowExamModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    const [showCreateAvailabilityModal, setShowCreateAvailabilityModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [mobileView, setMobileView] = useState(window.innerWidth < 768);

    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [refreshTriggerAvailability, setRefreshTriggerAvailability] = useState(false);
    const [refreshTriggerExam, setRefreshTriggerExam] = useState(false);
    const [refreshTriggerShift, setRefreshTriggerShift] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [classes, setClasses] = useState([]);

    const apiClient = useApiClient();

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);

            const [exams, availabilities, classes, shifts] = await Promise.all([
                apiClient.exam.getByIAM(IAM),
                apiClient.availability.getByIAM(IAM),
                apiClient.exam.getClasses(),
                apiClient.shift.get(IAM),
            ]);

            console.log(shifts)

            setClasses(classes);

            const calendarEvents = await getExams(currentUser, exams, classes);

            if (!calendarEvents.success) {
                toast.error(`${t('toast.calendar.loading.error')}`);
            }

            const calendarAvailabilities = await getAvailabilities(availabilities);
            const calendarShifts = getShiftEvents(shifts);

            setCalendarEvent(calendarEvents.data);
            setCalendarAvailability(calendarAvailabilities);
            setCalendarShift(calendarShifts);

            toast.update(toastIdLoading.current, { type: 'success', autoClose: 5000, render: `${t('toast.calendar.loading.success')}` });
            setIsLoading(false);
        }

        fetchData();
    }, [IAM, apiClient.availability, apiClient.exam, apiClient.shift, currentUser, t]);

    useEffect(() => {
        const handleResize = () => {
            // Set initialView based on screen size
            if (window.innerWidth < 768) {
                setMobileView(true);
            } else {
                setMobileView(false);
            }
        };

        // Call handleResize initially
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!refreshTrigger && !refreshTriggerAvailability && !refreshTriggerExam && !refreshTriggerShift) return;
        async function fetchData() {
            setIsLoading(true);

            // Check what needs refreshing
            if (refreshTriggerExam) {
                toastIdRefreshing.current = toast.info(`${t('toast.calendar.refreshing.exams')}`, { autoClose: false });
                const exams = await apiClient.exam.getByIAM(IAM);
                console.log(exams)
                const calendarEvents = await getExams(currentUser, exams, classes);
                console.log(calendarEvents)
                setCalendarEvent(calendarEvents.data);
            }

            if (refreshTriggerAvailability) {
                toastIdRefreshing.current = toast.info(`${t('toast.calendar.refreshing.availabilities')}`, { autoClose: false });
                const availabilities = await apiClient.availability.getByIAM(IAM);
                const calendarAvailabilities = await getAvailabilities(availabilities);
                setCalendarAvailability(calendarAvailabilities);
            }

            if (refreshTriggerShift) {
                toastIdRefreshing.current = toast.info(`${t('toast.calendar.refreshing.shifts')}`, { autoClose: false });
                const shifts = await getShifts();
                const calendarShifts = getShiftEvents(shifts);
                setCalendarShift(calendarShifts);
            }

            toast.update(toastIdRefreshing.current, { type: 'success', autoClose: 5000, render: `${t('toast.calendar.refreshing.success')}` });
            setIsLoading(false);
        }

        fetchData();
        setRefreshTrigger(false);
        setRefreshTriggerAvailability(false);
        setRefreshTriggerExam(false);
        setRefreshTriggerShift(false);
    }, [IAM, apiClient.availability, apiClient.exam, classes, currentUser, refreshTrigger, refreshTriggerAvailability, refreshTriggerExam, refreshTriggerShift, t]);

    if (!currentUser?.IAM) {
        return <NotAuthorized />
    }

    const refreshDataAvailability = () => {
        setRefreshTriggerAvailability((prev) => !prev);
    };

    const refreshDataExam = () => {
        setRefreshTriggerExam((prev) => !prev);
    };

    //const refreshDataShift = () => {
    //    setRefreshTriggerShift((prev) => !prev);
    //};

    const handleSelect = async (e) => {
        const calendar = e.view.calendar;
        calendar.unselect();

        if (isLoading) return;

        const start = new Date(e.start);
        const end = new Date(e.end);

        const date = `${start.getMonth() + 1}-${start.getDate()}-${start.getFullYear()}`;
        const startTime = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const endTime = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const { isValid, event } = validateDate(date, startTime, endTime);

        if (isValid) {
            try {
                const createdAvailability = await apiClient.availability.create({
                    IAM: currentUser.IAM,
                    startTime: new Date(start),
                    endTime: new Date(end),
                })

                const newAvailabilityEvent = {
                    title: 'Available',
                    start: createdAvailability.startTime,
                    end: createdAvailability.endTime,
                    backgroundColor: '#0000FF',
                    id: createdAvailability._id,
                    extendedProps: { type: AVAILABILITY_TYPE, ...createdAvailability, user: currentUser },
                };

                setCalendarAvailability([...calendarAvailability, newAvailabilityEvent]);
                refreshDataAvailability();

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

    const handleEventClick = async (e) => {
        const event = e.event;
        const calendar = e.view.calendar;
        const isExam = event.extendedProps.type === EXAM_TYPE;
        const isAvailability = event.extendedProps.type === AVAILABILITY_TYPE;
        const isShift = event.extendedProps.type === SHIFT_TYPE;

        calendar.unselect();
        calendar.refetchEvents();

        if (isExam) {
            setSelectedExam(event);
            setShowExamModal(true);
            return;
        } else if (isAvailability) {
            setSelectedAvailability(event);
            setShowAvailabilityModal(true);
            return;
        } else if (isShift) {
            setSelectedShift(event);
            setShowShiftModal(true);
            return;
        }
    };

    const handleAvailabilityDelete = async (id, IAM) => {
        setShowAvailabilityModal(false);
        try {
            try {
                await apiClient.availability.delete({
                    id,
                    IAM
                })

                setCalendarAvailability(calendarAvailability.filter((event) => event.id !== id));
                toast.success(`${t('toast.calendar.availability.delete.success')}`);
                refreshDataAvailability();
            } catch (error) {
                toast.error(`${t('toast.calendar.availability.delete.error')}`);
            }
        } catch (err) {
            toast.error(`${t('toast.calendar.availability.delete.error')}`);
        }
    };

    const handleViewDidMount = (info) => {
        const viewType = info.view.type;
        localStorage.setItem(VIEW_TYPE_KEY, viewType);
    };

    const handleDateClick = (dateClicked) => {
        if (!dateClicked.allDay) return false;
        const date = new Date(dateClicked.date);

        const dateStr = formatDate(date);
        const { isValid, event } = validateDate(date);


        if (!isValid) {
            const type = event.extendedProps.type;
            toast.error(`${t(`toast.availability.overlap.${type}`)}`);
        } else {
            setSelectedDate(dateStr);
            setShowCreateAvailabilityModal(true);
        }

    };

    const handleEventResize = async (e) => {
        const event = e.event;
        const { start, end } = event;

        const newStartDate = new Date(start);
        const newEndDate = new Date(end);

        // Ensure that the start date is after or equal to 08:00
        if (newStartDate.getHours() < 8) {
            newStartDate.setHours(8, 0, 0, 0);
        }
        // Ensure that the end date is before or equal to 18:00
        if (newEndDate.getHours() > 18) {
            newEndDate.setHours(18, 0, 0, 0);
        }

        // Ensure that the sart and end dates are in the same day
        if (newStartDate.toDateString() !== newEndDate.toDateString()) {
            newEndDate.setDate(newStartDate.getDate());
            newEndDate.setHours(18, 0, 0, 0);
        }

        await updateAvailability(newStartDate, newEndDate, event.id);
    };

    const updateAvailability = async (start, end, id) => {
        try {
            await apiClient.availability.update({
                id,
                startTime: start,
                endTime: end
            })
            refreshDataAvailability();
        } catch (error) {
            toast.error(`${t('toast.calendar.availability.update.error')}`);
        }
    }

    const calendarAndModal = (
        <>
            {
                mobileView ? <div id="oopss">
                    <NoMobilePage />
                </div> : <div className="calendar-container">
                    <CalendarComponent
                        events={[...calendarEvent, ...calendarAvailability, ...calendarShift]}
                        handleEventClick={handleEventClick}
                        handleSelect={handleSelect}
                        handleViewDidMount={handleViewDidMount}
                        selectable={true}
                        customButtons={{
                            createAvailabilityButton: {
                                text: `${t('calendar.button.create_availability')}`,

                                click: () => {
                                    setShowCreateAvailabilityModal(true);
                                }
                            }
                        }}
                        loading={isLoading}
                        handleDateClick={handleDateClick}
                        handleEventResize={handleEventResize}
                    />
                    <AvailabilityModal
                        show={showAvailabilityModal}
                        handleClose={() => setShowAvailabilityModal(false)}
                        event={selectedAvailability}
                        handleDelete={handleAvailabilityDelete}
                        updateAvailability={updateAvailability}
                    />
                    <ShiftModal
                        show={showShiftModal}
                        handleClose={() => setShowShiftModal(false)}
                        event={selectedShift}
                    />
                    <ExamModal
                        event={selectedExam}
                        handleClose={() => setShowExamModal(false)}
                        show={showExamModal}
                        refreshData={refreshDataExam}
                    />
                    <CreateAvailabilityModal
                        show={showCreateAvailabilityModal}
                        handleClose={() => setShowCreateAvailabilityModal(false)}
                        events={calendarEvent}
                        currentUser={currentUser}
                        refreshData={() => refreshDataAvailability()}
                        selectedDate={selectedDate}
                    />
                </div>
            }
        </>
    )

    return calendarAndModal;
}

function convertExamTimeToDate(examDate, startTime, endTime) {
    // Parse examDate into a Date object
    const parsedExamDate = new Date(
        `${examDate.toString().slice(0, 4)}-${examDate.toString().slice(4, 6)}-${examDate.toString().slice(6)}`
    );

    // Extract hours and minutes from startTime and endTime
    const startHours = Math.floor(startTime / 100);
    const startMinutes = startTime % 100;

    const endHours = Math.floor(endTime / 100);
    const endMinutes = endTime % 100;

    // Set the time on the parsedExamDate
    const startDate = new Date(parsedExamDate);
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date(parsedExamDate);
    endDate.setHours(endHours, endMinutes, 0, 0);

    return { startDate, endDate };
}

async function getExams(user, exams, classes) {
    // Check class
    const hasClass = await verifyClass(user.studentClass, classes);

    if (!hasClass.success) {
        return { success: false, data: [] }
    }

    try {
        const calendarEvents = []
        for (let i = 0; i < exams.length; i++) {
            const exam = exams[i];

            const { endDate, startDate } = convertExamTimeToDate(exam.examDate, exam.startTime, exam.endTime);

            // Create a date 1 hour before the start date
            const oneHourBeforeStart = new Date(startDate);
            oneHourBeforeStart.setHours(oneHourBeforeStart.getHours() - 1);

            calendarEvents.push({
                title: exam.name,
                start: startDate,
                end: endDate,
                extendedProps: { ...exam, type: 'exam' },
                backgroundColor: colors.events.exams,
            });

            calendarEvents.push({
                start: oneHourBeforeStart,
                end: endDate,
                display: 'background',
                backgroundColor: colors.events.exams,
                extendedProps: { ...exam, type: 'exam' },
            });
        }

        return { success: true, data: calendarEvents }
    } catch (error) {
        console.error(error);
        return { success: false, data: [] }
    }
}

async function getAvailabilities(availabilities) {
    try {
        const availabilityEvents = [];

        for (let i = 0; i < availabilities.length; i++) {
            const availability = availabilities[i];
            // Mark as available
            let title = 'Available';
            const isVerifiedAvailability = availability.confirmed;

            // If true, mark as in service/working/availability confirmed
            if (isVerifiedAvailability) {
                title == `Confirmed Availability`
            }

            const res = await getMember(availability.IAM)
            const user = await res.data;

            let color = colors.events.availability

            // If the availability is in the past or today set the color to orange
            if (moment(availability.startTime).isSame(moment(), 'day') || moment(availability.startTime).isBefore(moment())) {
                color = colors.events.expiredAvailability;
            }

            availabilityEvents.push({
                title,
                start: availability.startTime,
                end: availability.endTime,
                id: availability._id,
                backgroundColor: color,
                extendedProps: { ...availability, type: 'availability', user },
                durationEditable: true,
            });
        }

        return availabilityEvents;
    } catch (error) {
        console.error(error)
    }
}

function getShiftEvents(shifts) {
    const shiftEvents = [];

    for (let i = 0; i < shifts.length; i++) {
        const shift = shifts[i];

        const event = {
            title: shift.title,
            start: shift.startDate,
            end: shift.endDate,
            id: shift._id,
            backgroundColor: colors.events.shifts,
            extendedProps: { ...shift, type: 'shift' },
        };
        shiftEvents.push(event);
    }

    return shiftEvents;
}

async function getShifts() {
    const res = await fetch(`/api/v1/shift/fetch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const dataJson = await res.json();
    if (dataJson.success === false) return [];

    const data = dataJson.data;

    return data;
}