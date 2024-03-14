import { useSelector } from 'react-redux'
import { NotAuthorized } from './ErrorPages/Pages/401'
import Calendar from '../components/Calendar/Calendar'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getMember } from '../utils'
import AvailabilityModal from '../components/Calendar/AvailabilityModal'
import { t } from 'i18next'

const AdminDashboard = () => {
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user)
    const toastIdLoading = useRef(null);
    const IAM = currentUser.IAM;
    const [calendarAvailability, setCalendarAvailability] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Get all availabilities    
    useEffect(() => {
        async function fetchData() {
            toastIdLoading.current = toast.info(`${t('calendar.loading')}`, { autoClose: false });

            const calendarAvailabilities = await getCalendarAvailabilities();

            setCalendarAvailability(calendarAvailabilities);

            toast.update(toastIdLoading.current, { type: 'success', autoClose: 5000, render: `${t('calendar.loading.success')}` });
        }

        fetchData();
    }, [IAM, currentUser, t]);

    const roles = currentUser?.roles;
    // If user is not an admin, redirect to 401 page
    if (!roles?.includes('admin')) {
        return <NotAuthorized />
    }

    const handleEventClick = (e) => {
        const event = e.event;
        const calendar = e.view.calendar;
        calendar.unselect();

        if (event?.extendedProps?.type === 'availability') {
            console.log(event);
            setSelectedEvent(event);
            setShowModal(true);
        }
    }

    return (
        <div>
            <Calendar
                events={calendarAvailability}
                handleEventClick={handleEventClick}
                selectable={false}
            />
            <AvailabilityModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                event={selectedEvent}
                handleDelete={handleDelete}
            />
        </div>
    );

    async function handleDelete(id, IAM, event) {
        setShowModal(false);
        const res = await deleteAvailability(id, IAM);
        if (res.success) {
            setCalendarAvailability(calendarAvailability.filter((availability) => availability.id !== id));
            toast.success(`${t('calendar.availability.delete.success')}`);
            event.remove();
        } else {
            toast.error(`${t('calendar.availability.delete.error')}`);
        }
    }
}

export default AdminDashboard;

async function getAvailabilities() {
    const res = await fetch(`/api/availability/all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await res.json();

    return data;
}
async function getCalendarAvailabilities() {
    // Get all availabilities
    const data = await getAvailabilities();

    const allDayEvents = await getAllDayEvent(data)
    const calendarAvailabilities = [...allDayEvents];

    for (let i = 0; i < data.length; i++) {
        const availability = data[i];
        const res = await getMember(availability.IAM);
        if (!res.success) return toast.error('Could not get member');
        const user = await res.data;

        calendarAvailabilities.push({
            title: `${user.firstName} ${user.lastName}`,
            start: availability.startTime,
            end: availability.endTime,
            extendedProps: {
                type: 'availability',
                availability,
                user
            },
            id: availability._id
        })
    }

    return calendarAvailabilities;
}
function getAllDayEvent(availabilities) {
    // Group availabilities by day
    const availabilitiesByDay = availabilities.reduce((acc, availability) => {
        const day = availability.startTime.split("T")[0];
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(availability);
        return acc;
    }, {});

    const allDayEvents = [];

    // Iterate through days with availabilities
    for (const day in availabilitiesByDay) {
        if (availabilitiesByDay.hasOwnProperty(day)) {
            // Sort availabilities by start time
            availabilitiesByDay[day].sort((a, b) => {
                return new Date(a.startTime) - new Date(b.startTime);
            });

            let currentAllDay = { allDay: true, extendedProps: {} };
            const overlappingAvailabilities = [];

            // Iterate through sorted availabilities
            for (let i = 0; i < availabilitiesByDay[day].length; i++) {
                const availability = availabilitiesByDay[day][i];

                // If availability overlaps with current allDay, add it to overlappingAvailabilities
                if (
                    currentAllDay.extendedProps.overlappingAvailabilities &&
                    new Date(availability.startTime) <
                    new Date(currentAllDay.extendedProps.overlappingAvailabilities[currentAllDay.extendedProps.overlappingAvailabilities.length - 1].endTime)
                ) {
                    overlappingAvailabilities.push(availability);
                } else {
                    // If availability doesn't overlap, create a new allDay object
                    currentAllDay = {
                        allDay: true,
                        extendedProps: {
                            overlappingAvailabilities: [availability]
                        },
                        date: new Date(availability.startTime),
                        title: `There are "${availabilitiesByDay[day].length}" on this day! Click to view more info`,
                    };
                }
            }

            if (overlappingAvailabilities.length > 1) {
                currentAllDay.extendedProps.overlappingAvailabilities = overlappingAvailabilities;
                allDayEvents.push(currentAllDay);
            }
        }
    }

    return allDayEvents;
}
async function deleteAvailability(id, IAM) {
    try {
        const res = await fetch(`/api/availability/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ IAM: IAM }),
        })

        const data = await res.json()

        if (data?.success != true) return { success: false, message: `${t('calendar.availability.delete.success')}` }
        return { success: true }
    } catch (err) {
        return { success: false, message: err.message }
    }
}