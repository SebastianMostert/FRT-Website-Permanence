/* eslint-disable react/prop-types */
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';
import interaction from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import DayCell from './DayCell';
import SlotLane from './SlotLane';
import SlotLabel from './SlotLabel';
import DayHeader from './DayHeader';

const VIEW_TYPE_KEY = 'viewType';

const Calendar = ({ events, handleEventClick, handleSelect, handleViewDidMount }) => {
    return (
        <FullCalendar
            plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin, interaction, bootstrap5Plugin]}
            initialView={localStorage.getItem(VIEW_TYPE_KEY) || 'dayGridMonth'}
            events={events}
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
    )
}

export default Calendar