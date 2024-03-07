import FullCalendar from '@fullcalendar/react'

import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import timeGridPlugin from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';

import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux'

const VIEW_TYPE_KEY = 'viewType';

export default function Calendar() {
    const toastId = React.useRef(null);
    const { currentUser } = useSelector((state) => state.user);

    const businessHours = {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '08:00',
        endTime: '18:00',
    }

    const view = localStorage.getItem(VIEW_TYPE_KEY) || 'dayGridMonth';
    const IAM = currentUser.IAM;

    const [calendarEvent, setCalendarEvent] = useState([]);
    const [calendarAvailability, setCalendarAvailability] = useState([]);

    useEffect(() => {
        async function fetchData() {
            toastId.current = toast.info('Loading exams...', { autoClose: false });
            const calendarEvents = await getExams(IAM);
            setCalendarEvent(calendarEvents);
            toast.update(toastId.current, { type: 'success', autoClose: 5000, render: 'Exams loaded successfully!' });

            // Get availabilities
            toastId.current = toast.info('Loading availabilities...', { autoClose: false });
            const calendarAvailabilities = await getAvailabilities(IAM);
            setCalendarAvailability(calendarAvailabilities);
            toast.update(toastId.current, { type: 'success', autoClose: 5000, render: 'Availabilities loaded successfully!' });
        }

        fetchData();
    }, [IAM]);

    return (
        <>
            <FullCalendar
                plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin, interaction]}
                initialView={view}

                events={[...calendarEvent, ...calendarAvailability]}

                businessHours={businessHours}
                firstDay={1}
                navLinks={true}
                nowIndicator={true}
                selectable={true}

                height={'auto'}
                titleFormat={{
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                eventTimeFormat={{
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay',
                }}

                views={{
                    timeGridDay: {
                        buttonText: 'Day',
                    },
                    timeGridWeek: {
                        buttonText: 'Week',
                    },
                    dayGridMonth: {
                        buttonText: 'Month',
                    },
                    multiMonthYear: {
                        buttonText: 'Year',
                    },
                }}
                eventClick={(e) => {
                    const isExam = e.event.extendedProps.type === 'exam';
                    if (isExam) {
                        toast.error("You are not availabe on this day!", {
                            theme: 'colored',
                        })
                    }
                }}

                selectOverlap={() => {
                    return false
                }}

                selectConstraint={{
                    startTime: '08:00',
                    endTime: '18:00',
                    daysOfWeek: [1, 2, 3, 4, 5],
                }}

                select={async (e) => {
                    // const view = e.view.type
                    const calendar = e.view.calendar
                    calendar.unselect();
                    const start = new Date(e.start);
                    const end = new Date(e.end);

                    const createdAvailability = await createAvailability(start, end, currentUser)

                    if (!createdAvailability.success) return;
                    const availability = createdAvailability.data;
                    if (!availability) return

                    calendar.addEvent({
                        title: 'Available',
                        start: availability.startTime,
                        end: availability.endTime,
                        backgroundColor: '#00FF00',
                    })


                    return false
                }}

                viewDidMount={(info) => {
                    const viewType = info.view.type

                    localStorage.setItem(VIEW_TYPE_KEY, viewType)
                }}
            />
        </>
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

async function getExams(IAM) {
    try {
        const calendarEvents = []
        const examResponse = await fetch(`/api/exam/user/${IAM}`, { method: "post" });

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

        return calendarEvents;
    } catch (error) {
        console.error(error);
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

            availabilityEvents.push({
                title: 'Available',
                start: availability.startTime,
                end: availability.endTime,
                id: availability._id,
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

async function deleteAvailability() {
    // TODO
}