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
import EventCell from './EventCell';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const VIEW_TYPE_KEY = 'viewType';
const hideToolbarSize = 1000;

const Calendar = ({ events, handleEventClick, handleSelect, handleViewDidMount, selectable, customButtons, loading, handleDateClick, handleEventResize }) => {
    const { t } = useTranslation();
    const [headerToolbar, setHeaderToolbar] = useState({
        left: 'prev,next today',
        center: 'title',
        right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay',
    });

    useEffect(() => {
        const handleResize = () => {
            // Set initialView based on screen size
            if (window.innerWidth <= hideToolbarSize) {

                if (customButtons) {
                    setHeaderToolbar({
                        left: 'prev,next today',
                        center: 'title',
                        right: 'createAvailabilityButton',
                    });
                } else {
                    setHeaderToolbar({
                        left: 'prev,next today',
                        center: 'title',
                    });
                }
            } else {
                if (customButtons) {
                    setHeaderToolbar({
                        left: 'prev,next today',
                        center: 'title',
                        right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay createAvailabilityButton',
                    });
                } else {
                    setHeaderToolbar({
                        left: 'prev,next today',
                        center: 'title',
                        right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
                    });
                }
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
    }, [customButtons]);

    useEffect(() => {
        if (loading) {
            setHeaderToolbar({
                left: 'prev,next today',
                center: 'title',
                right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay',
            });
        } else {
            if (customButtons) {
                setHeaderToolbar({
                    left: 'prev,next today',
                    center: 'title',
                    right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay createAvailabilityButton',
                });
            } else {
                setHeaderToolbar({
                    left: 'prev,next today',
                    center: 'title',
                    right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
                });
            }
        }
    }, [customButtons, loading]);

    return (
        <FullCalendar
            plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin, interaction, bootstrap5Plugin]}
            initialView={window.localStorage.getItem(VIEW_TYPE_KEY) || 'dayGridMonth'}
            windowResize={(e) => {
                const localStorage = window.localStorage;
                const localStorageType = localStorage.getItem(VIEW_TYPE_KEY);
                const newViewType = window.innerWidth <= hideToolbarSize ? 'timeGridWeek' : localStorageType || 'dayGridMonth';
                localStorage.setItem(VIEW_TYPE_KEY, newViewType);

                const calendar = e.view.calendar;

                calendar.changeView(newViewType);
            }}

            events={events}
            businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '08:00',
                endTime: '18:00',
            }}
            firstDay={1}
            nowIndicator={true}
            weekends={false}

            // Selection
            selectConstraint={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '08:00',
                endTime: '18:00',
            }}
            selectOverlap={() => false}
            selectLongPressDelay={1000}
            eventLongPressDelay={1000}
            longPressDelay={1000}
            selectable={selectable}
            dateClick={handleDateClick}

            // Handlers
            eventClick={handleEventClick}
            select={handleSelect}
            viewDidMount={handleViewDidMount}
            eventResize={handleEventResize}

            // Styling
            headerToolbar={headerToolbar}
            customButtons={customButtons}
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
                today: `${t('calendar.button.today')}`,
                month: `${t('calendar.button.month')}`,
                week: `${t('calendar.button.week')}`,
                day: `${t('calendar.button.day')}`,
                multiMonthYear: `${t('calendar.button.year')}`,
            }}
            eventDisplay="block"
            windowResizeDelay={100}
            handleWindowResize={true}
            aspectRatio={1.5}
            views={{
                timeGridDay: { buttonText: `${t('calendar.button.day')}` },
                timeGridWeek: { buttonText: `${t('calendar.button.week')}` },
                dayGridMonth: { buttonText: `${t('calendar.button.month')}` },
                multiMonthYear: { buttonText: `${t('calendar.button.year')}` },
            }}
            dayCellContent={(arg) => <DayCell arg={arg} />}
            slotMinTime={'08:00'}
            slotMaxTime={'18:00'}
            slotLabelInterval={{ minutes: 30 }}
            slotLaneContent={(arg) => <SlotLane arg={arg} />}
            slotLabelContent={(arg) => <SlotLabel arg={arg} />}
            dayHeaderContent={(arg) => <DayHeader arg={arg} />}
            eventContent={(arg) => <EventCell arg={arg} />}
        />
    )
}

export default Calendar
