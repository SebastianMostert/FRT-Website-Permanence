import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { verifyClass } from '../utils';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';
import interaction from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import '../Styles/CustomCalendar.css'; // Import your custom CSS stylesheet
import DayCell from '../components/Calendar/DayCell';
import SlotLane from '../components/Calendar/SlotLane';
import SlotLabel from '../components/Calendar/SlotLabel';
import DayHeader from '../components/Calendar/DayHeader';

const VIEW_TYPE_KEY = 'viewType';
const EXAM_TYPE = 'exam';
const AVAILABILITY_TYPE = 'availability';

export default function Calendar() {
    const toastIdLoading = useRef(null);
    const { currentUser } = useSelector((state) => state.user);
    const IAM = currentUser.IAM;

    const [calendarEvent, setCalendarEvent] = useState([]);
    const [calendarAvailability, setCalendarAvailability] = useState([]);

    useEffect(() => {
        async function fetchData() {
            toastIdLoading.current = toast.info('Loading exams and availabilities...', { autoClose: false });

            const calendarEvents = await getExams(currentUser);

            if (!calendarEvents.success) {
                toast.error('Failed to load exams! Verify you\'ve provided the correct class in the profile page!');
            }

            const calendarAvailabilities = await getAvailabilities(IAM);

            setCalendarEvent(calendarEvents.data);
            setCalendarAvailability(calendarAvailabilities);

            toast.update(toastIdLoading.current, { type: 'success', autoClose: 5000, render: 'Exams and availabilities loaded successfully!' });
        }

        fetchData();
    }, [IAM, currentUser]);

    const handleSelect = async (e) => {
        const calendar = e.view.calendar;
        calendar.unselect();
        const start = new Date(e.start);
        const end = new Date(e.end);

        const createdAvailability = await createAvailability(start, end, currentUser);

        if (!createdAvailability.success) return;

        const availability = createdAvailability.data;
        if (!availability) return;

        const newAvailabilityEvent = {
            title: 'Available',
            start: availability.startTime,
            end: availability.endTime,
            backgroundColor: '#0000FF',
            id: availability._id,
            extendedProps: { type: AVAILABILITY_TYPE, ...availability },
        };

        setCalendarAvailability([...calendarAvailability, newAvailabilityEvent]);
    };

    const handleEventClick = async (e) => {
        const event = e.event;
        const calendar = e.view.calendar;
        const isExam = event.extendedProps.type === EXAM_TYPE;
        const isAvailability = event.extendedProps.type === AVAILABILITY_TYPE;

        calendar.unselect();
        calendar.refetchEvents();

        if (isExam) {
            toast.error("You are not available on this day!", { theme: 'colored' });
        }

        if (isAvailability) {
            handleAvailabilityDelete(event.id);
        }
    };

    const handleAvailabilityDelete = async (id) => {
        try {
            const result = await deleteAvailability(id, IAM);

            if (result.success) {
                setCalendarAvailability(calendarAvailability.filter((event) => event.id !== id));
                toast.success('Availability deleted successfully!');
            } else {
                toast.error('Failed to delete availability!');
            }
        } catch (err) {
            toast.error('Failed to delete availability!');
        }
    };

    const handleViewDidMount = (info) => {
        const viewType = info.view.type;
        localStorage.setItem(VIEW_TYPE_KEY, viewType);
    };

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin, interaction, bootstrap5Plugin]}
                initialView={localStorage.getItem(VIEW_TYPE_KEY) || 'dayGridMonth'}
                events={[...calendarEvent, ...calendarAvailability]}
                businessHours={{ daysOfWeek: [1, 2, 3, 4, 5], startTime: '08:00', endTime: '18:00' }}
                firstDay={1}
                nowIndicator={true}
                weekends={false}

                // Selection
                selectConstraint={{ startTime: '08:00', endTime: '18:00', daysOfWeek: [1, 2, 3, 4, 5] }}
                selectOverlap={() => false}
                selectLongPressDelay={1000}
                eventLongPressDelay={1000}
                longPressDelay={1000}
                selectable={true}

                // Handlers
                eventClick={handleEventClick}
                select={handleSelect}
                viewDidMount={handleViewDidMount}

                // Styling
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay' }}
                navLinks={true}
                height={'auto'}
                titleFormat={{ year: 'numeric', month: 'short', day: '2-digit' }}
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                eventTimeFormat={{ hour12: false, hour: '2-digit', minute: '2-digit' }}
                themeSystem="bootstrap5"
                buttonIcons={{
                    prev: 'bi-chevron-left',
                    next: 'bi-chevron-right',
                    prevYear: 'bi-skip-backward',
                    nextYear: 'bi-skip-forward'
                }}
                buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                    multiMonthYear: 'Year'
                }}
                eventDisplay="block"
                windowResizeDelay={100}
                handleWindowResize={true}
                aspectRatio={1.5}
                views={{
                    timeGridDay: { buttonText: 'Day' },
                    timeGridWeek: { buttonText: 'Week' },
                    dayGridMonth: { buttonText: 'Month' },
                    multiMonthYear: { buttonText: 'Year' },
                }}
                dayCellContent={(arg) => <DayCell arg={arg} />}
                slotMinTime={'08:00'}
                slotMaxTime={'18:00'}
                slotEventOverlap={true}
                slotLabelInterval={{ minutes: 30 }}
                slotLaneContent={(arg) => <SlotLane arg={arg} />}
                slotLabelContent={(arg) => <SlotLabel arg={arg} />}
                dayHeaderContent={(arg) => <DayHeader arg={arg} />}
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
        const examResponse = await fetch(`/api/exam/user/${user.IAM}`, { method: "post" });

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
        const res = await fetch(`/api/availability/get/${IAM}`, {
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

            availabilityEvents.push({
                title,
                start: availability.startTime,
                end: availability.endTime,
                id: availability._id,
                backgroundColor: isVerifiedAvailability ? '#00FF00' : '#0000FF',
                extendedProps: { ...availability, type: 'availability' },
            });
        }

        return availabilityEvents;
    } catch (error) {
        console.log(error)
    }
}

async function createAvailability(start, end, user) {
    try {
        const res = await fetch('/api/availability/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ IAM: user.IAM, startTime: start, endTime: end }),
        })

        const data = await res.json()

        if (data?.success != true) {
            toast.error(`An error occured while creating your availability!`)
            return { success: false, data: null }
        }
        toast.success(`You have been marked as available from ${moment(start).format('HH:mm')} to ${moment(end).format('HH:mm')}`)
        return { success: true, data: data.availability }
    } catch (error) {
        toast.error(`An error occured while creating your availability: ${error.message}`)
        return { success: false, data: null }
    }
}

async function deleteAvailability(id, IAM) {
    try {
        console.log(id)
        console.log(id)
        const res = await fetch(`/api/availability/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ IAM: IAM }),
        })

        const data = await res.json()

        if (data?.success != true) return { success: false, message: 'Deleted availability' }
        return { success: true }
    } catch (err) {
        return { success: false, message: err.message }
    }
}