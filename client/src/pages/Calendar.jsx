import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { getMember, isSmallMobile, verifyClass } from '../utils';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../Styles/CustomCalendar.css'; // Import your custom CSS stylesheet

import CalendarComponent from '../components/Calendar/Calendar';
import { NotAuthorized } from './ErrorPages/Pages/401';
import { useTranslation } from 'react-i18next';
import AvailabilityModal from '../components/Calendar/AvailabilityModal';
import NoMobilePage from './ErrorPages/Pages/NoMobilePage';

const VIEW_TYPE_KEY = 'viewType';
const EXAM_TYPE = 'exam';
const AVAILABILITY_TYPE = 'availability';
const SHIFT_TYPE = 'shift';


export default function Calendar() {
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user)
    const toastIdLoading = useRef(null);
    const IAM = currentUser.IAM;

    const [calendarEvent, setCalendarEvent] = useState([]);
    const [calendarAvailability, setCalendarAvailability] = useState([]);
    const [calendarShift, setCalendarShift] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            toastIdLoading.current = toast.info(`${t('calendar.loading')}`, { autoClose: false });

            const calendarEvents = await getExams(currentUser);

            if (!calendarEvents.success) {
                toast.error(`${t('calendar.loading.error')}`);
            }

            const calendarAvailabilities = await getAvailabilities(IAM);
            const calendarShifts = await getShifts();

            setCalendarEvent(calendarEvents.data);
            setCalendarAvailability(calendarAvailabilities);
            setCalendarShift(calendarShifts);

            toast.update(toastIdLoading.current, { type: 'success', autoClose: 5000, render: `${t('calendar.loading.success')}` });
        }

        fetchData();
    }, [IAM, currentUser]);

    if (!currentUser?.IAM) {
        return <NotAuthorized />
    }

    if (isSmallMobile()) return <NoMobilePage />

    const handleSelect = async (e) => {
        const calendar = e.view.calendar;
        calendar.unselect();
        const start = new Date(e.start);
        const end = new Date(e.end);

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
            toast.error(`${t('calendar.unavailable')}`, { theme: 'colored' });
            return;
        } else if (isAvailability) {
            const event = e.event;
            calendar.unselect();

            if (event?.extendedProps?.type === 'availability') {
                setSelectedEvent(event);
                setShowModal(true);
            }
        } else if (isShift) {
            toast.error(`${t('calendar.unavailable')}`, { theme: 'colored' });
            return;
        }
    };

    const handleAvailabilityDelete = async (id, IAM) => {
        setShowModal(false);
        try {
            const result = await deleteAvailability(id, IAM, t);

            if (result.success) {
                setCalendarAvailability(calendarAvailability.filter((event) => event.id !== id));
                toast.success(`${t('calendar.availability.delete.success')}`);
            } else {
                toast.error(`${t('calendar.availability.delete.error')}`);
            }
        } catch (err) {
            toast.error(`${t('calendar.availability.delete.error')}`);
        }
    };

    const handleViewDidMount = (info) => {
        const viewType = info.view.type;
        localStorage.setItem(VIEW_TYPE_KEY, viewType);
    };

    return (
        <div className="calendar-container">
            <CalendarComponent
                events={[...calendarEvent, ...calendarAvailability, ...calendarShift]}
                handleEventClick={handleEventClick}
                handleSelect={handleSelect}
                handleViewDidMount={handleViewDidMount}
                selectable={true}
            />
            <AvailabilityModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                event={selectedEvent}
                handleDelete={handleAvailabilityDelete}
            />
        </div>
    );
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

            const fullDayStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`
            const fullDayEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`

            calendarEvents.push({
                title: exam.name,
                start: startDate,
                end: endDate,
                extendedProps: { ...exam, type: 'exam' },
                backgroundColor: '#FF0000',
            });

            calendarEvents.push({
                start: fullDayStartDate,
                end: fullDayEndDate,
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
            for (let i = 0; i < shift.shifts.length; i++) {
                const element = shift.shifts[i];

                const memberRes = await getMember(element.IAM)
                const member = await memberRes.data

                shiftEvents.push({
                    title: 'Shift',
                    start: element.startDate,
                    end: element.endDate,
                    id: element._id,
                    backgroundColor: '#00FF00',
                    extendedProps: { shiftObject: element, userObject: member, type: SHIFT_TYPE },
                });
            }
        }
        return shiftEvents;
    } catch (error) {
        console.log(error)
    }
}

async function createAvailability(start, end, user, t) {
    try {
        const res = await fetch('/api/v1/availability/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ IAM: user.IAM, startTime: start, endTime: end }),
        })

        const data = await res.json()

        if (data?.success != true) {
            toast.error(`${t('calendar.availability.create.error')}`);
            return { success: false, data: null }
        }
        toast.success(`${t('calendar.availability.create.success', { startTime: moment(start).format('HH:mm'), endTime: moment(end).format('HH:mm') })}`)
        return { success: true, data: data.availability }
    } catch (error) {
        toast.error(`${t('calendar.availability.create.error')}`);
        return { success: false, data: null }
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

        if (data?.success != true) return { success: false, message: `${t('calendar.availability.delete.success')}` }
        return { success: true }
    } catch (err) {
        return { success: false, message: err.message }
    }
}