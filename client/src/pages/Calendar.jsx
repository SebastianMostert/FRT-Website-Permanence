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
import { verifyClass } from '../utils'

const VIEW_TYPE_KEY = 'viewType';

export default function Calendar() {
    const toastId_loading = React.useRef(null);

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
            toastId_loading.current = toast.info('Loading exams and availabilities...', { autoClose: false });

            // Get exams and availabilities
            const calendarEvents = await getExams(currentUser);
            if (!calendarEvents.success) toast.error('Failed to load exams! Verify you\'ve provided the correct class in the profile page!');

            const calendarAvailabilities = await getAvailabilities(IAM);

            // Set exams and availabilities
            setCalendarEvent(calendarEvents.data);
            setCalendarAvailability(calendarAvailabilities);

            // Update toast
            toast.update(toastId_loading.current, { type: 'success', autoClose: 5000, render: 'Exams and availabilities loaded successfully!' });
        }

        fetchData();
    }, [IAM, currentUser]);

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

                eventClick={async (e) => {
                    const event = e.event;
                    const calendar = e.view.calendar;
                    const isExam = event.extendedProps.type === 'exam';
                    const isAvailability = event.extendedProps.type === 'availability';

                    calendar.unselect();
                    calendar.refetchEvents();

                    if (isExam) {
                        toast.error("You are not availabe on this day!", {
                            theme: 'colored',
                        })
                    }

                    if (isAvailability) {
                        try {
                            const result = await deleteAvailability(event.id, IAM)

                            if (result.success) {
                                event.remove()
                                return toast.success('Availability deleted successfully!')
                            }
                            return toast.error('Failed to delete availability!')
                        } catch (err) {
                            return toast.error('Failed to delete availability!')
                        }
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
                        backgroundColor: '#0000FF',
                        id: availability._id,
                        extendedProps: {
                            type: 'availability',
                            ...availability
                        }
                    })


                    return false
                }}

                viewDidMount={(info) => {
                    const viewType = info.view.type

                    localStorage.setItem(VIEW_TYPE_KEY, viewType)
                }}

                longPressDelay={1000}
                eventLongPressDelay={1000}
                selectLongPressDelay={1000}
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


