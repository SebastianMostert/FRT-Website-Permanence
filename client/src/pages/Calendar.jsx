import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Calendar() {
    const view = localStorage.getItem('view') || 'dayGridMonth';
    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView={view}
        />
    );
}
