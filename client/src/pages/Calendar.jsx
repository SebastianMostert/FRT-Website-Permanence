import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { createAvailability, formatDate, getMember, validateDate, verifyClass } from '../utils';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../Styles/CustomCalendar.css'; // Import your custom CSS stylesheet

import CalendarComponent from '../components/Calendar/Calendar';
import { NotAuthorized } from './ErrorPages/Pages/401';
import { useTranslation } from 'react-i18next';
import AvailabilityModal from '../components/Calendar/AvailabilityModal';
import NoMobilePage from './ErrorPages/Pages/NoMobilePage';
import ShiftModal from '../components/Calendar/ShiftModal';
import ExamModal from '../components/Modals/ExamModal';
import CreateAvailabilityModal from '../components/Modals/CreateAvailabilityModal';

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

    useEffect(() => {
        async function fetchData() {
            toastIdLoading.current = toast.info(`${t('toast.calendar.loading')}`, { autoClose: false });
            setIsLoading(true);

            const calendarEvents = await getExams(currentUser);

            if (!calendarEvents.success) {
                toast.error(`${t('toast.calendar.loading.error')}`);
            }

            const calendarAvailabilities = await getAvailabilities(IAM);
            const calendarShifts = await getShifts();

            setCalendarEvent(calendarEvents.data);
            setCalendarAvailability(calendarAvailabilities);
            setCalendarShift(calendarShifts);

            toast.update(toastIdLoading.current, { type: 'success', autoClose: 5000, render: `${t('toast.calendar.loading.success')}` });
            setIsLoading(false);
        }

        fetchData();
    }, [IAM, currentUser, t]);

    useEffect(() => {
        const handleResize = () => {
            // Set initialView based on screen size
            if (window.innerWidth < 768) {
                console.log('mobile')
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
                const calendarEvents = await getExams(currentUser);

                if (!calendarEvents.success) {
                    toast.error(`${t('toast.calendar.refreshing.error')}`);
                }

                setCalendarEvent(calendarEvents.data);
            }

            if (refreshTriggerAvailability) {
                toastIdRefreshing.current = toast.info(`${t('toast.calendar.refreshing.availabilities')}`, { autoClose: false });
                const calendarAvailabilities = await getAvailabilities(IAM);
                setCalendarAvailability(calendarAvailabilities);
            }

            if (refreshTriggerShift) {
                toastIdRefreshing.current = toast.info(`${t('toast.calendar.refreshing.shifts')}`, { autoClose: false });
                const calendarShifts = await getShifts();
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
    }, [IAM, currentUser, refreshTrigger, refreshTriggerAvailability, refreshTriggerExam, refreshTriggerShift, t]);

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
            const createdAvailability = await createAvailability(start, end, currentUser, t);

            if (!createdAvailability.success) return;

            const availability = createdAvailability.data;
            if (!availability) return;

            const newAvailabilityEvent = {
                title: 'Available',
                start: availability.startTime,
                end: availability.endTime,
                backgroundColor: '#0000FF',
                id: availability._id,
                extendedProps: { type: AVAILABILITY_TYPE, ...availability, user: currentUser },
            };

            setCalendarAvailability([...calendarAvailability, newAvailabilityEvent]);
            refreshDataAvailability();
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
            const result = await deleteAvailability(id, IAM, t);

            if (result.success) {
                setCalendarAvailability(calendarAvailability.filter((event) => event.id !== id));
                toast.success(`${t('toast.calendar.availability.delete.success')}`);
                refreshDataAvailability();
            } else {
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
                    />
                    <AvailabilityModal
                        show={showAvailabilityModal}
                        handleClose={() => setShowAvailabilityModal(false)}
                        event={selectedAvailability}
                        handleDelete={handleAvailabilityDelete}
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

async function getExams(user) {
    // Check class
    const hasClass = await verifyClass(user.studentClass);

    if (!hasClass.success) {
        return { success: false, data: [] }
    }

    try {
        const calendarEvents = []
        const examResponse = await fetch(`/api/v1/exam/user/${user.IAM}`, { method: "post" });

        console.log(examResponse);
        const examsData = await examResponse.json();
        const exams = examsData.exams;

        for (let i = 0; i < exams.length; i++) {
            const exam = exams[i];

            const { endDate, startDate } = convertExamTimeToDate(exam.examDate, exam.startTime, exam.endTime);

            // Create a date 1 hour before the start date
            const oneHourBeforeStart = new Date(startDate);
            oneHourBeforeStart.setHours(oneHourBeforeStart.getHours() - 1);

            // Create a date that ends on the next full hour of the endDate
            const nextFullHourEndDate = new Date(endDate);
            nextFullHourEndDate.setMinutes(Math.ceil(endDate.getMinutes() / 60) * 60);

            calendarEvents.push({
                title: exam.name,
                start: startDate,
                end: endDate,
                extendedProps: { ...exam, type: 'exam' },
                backgroundColor: '#FF0000',
            });

            calendarEvents.push({
                start: oneHourBeforeStart,
                end: nextFullHourEndDate,
                display: 'background',
                backgroundColor: '#FF0000',
                extendedProps: { ...exam, type: 'exam' },
            });
        }

        return { success: true, data: calendarEvents }
    } catch (error) {
        console.error(error);
        return { success: false, data: [] }
    }
}

async function getAvailabilities(IAM) {
    try {
        const availabilityEvents = [];
        const res = await fetch(`/api/v1/availability/get/${IAM}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()

        for (let i = 0; i < data.length; i++) {
            const availability = data[i];
            // Mark as available
            let title = 'Available';
            const isVerifiedAvailability = availability.confirmed;

            // If true, mark as in service/working/availability confirmed
            if (isVerifiedAvailability) {
                title == `Confirmed Availability`
            }

            const res = await getMember(availability.IAM)
            const user = await res.data

            availabilityEvents.push({
                title,
                start: availability.startTime,
                end: availability.endTime,
                id: availability._id,
                backgroundColor: isVerifiedAvailability ? '#00FF00' : '#0000FF',
                extendedProps: { ...availability, type: 'availability', user },
            });
        }

        return availabilityEvents;
    } catch (error) {
        console.log(error)
    }
}

async function getShifts() {
    try {
        const shiftEvents = [];
        const res = await fetch(`/api/v1/shift/fetch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = (await res.json()).data

        for (let i = 0; i < data.length; i++) {
            const shift = data[i];
            const startTime = shift.shifts[0].startDate;
            const endTime = shift.shifts[0].endDate;
            const id = shift._id

            // Now get all the users of this shift
            const allUsers = [];
            for (let j = 0; j < shift.shifts.length; j++) {
                const element = shift.shifts[j];
                const IAM = element.IAM
                const memberRes = await getMember(IAM);
                const member = await memberRes.data;
                member.position = element.position
                allUsers.push(member);
            }

            shiftEvents.push({
                title: 'Shift',
                start: startTime,
                end: endTime,
                id,
                backgroundColor: '#00FF00',
                extendedProps: { shiftObject: shift, users: allUsers, type: SHIFT_TYPE },
            });
        }
        return shiftEvents;
    } catch (error) {
        console.log(error)
    }
}

async function deleteAvailability(id, IAM, t) {
    try {
        const res = await fetch(`/api/v1/availability/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ IAM: IAM, id: id }),
        })

        const data = await res.json()

        if (data?.success != true) return { success: false, message: `${t('toast.calendar.availability.delete.success')}` }
        return { success: true }
    } catch (err) {
        return { success: false, message: err.message }
    }
}