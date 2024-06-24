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
import { LoadingPage } from "../../pages"
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const VIEW_TYPE_KEY = 'viewType';
const hideToolbarSize = 1000;
const MOBILE_SIZE = 768;

const Calendar = ({ events, handleEventClick, handleSelect, handleViewDidMount, selectable, customButtons, loading, handleDateClick, handleEventResize }) => {
    const { t } = useTranslation();
    const [toolbarLoading, setToolbarLoading] = useState(true);
    const [titleFormat, setTitleFormat] = useState({
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const [headerToolbar, setHeaderToolbar] = useState({
        left: 'prev,next today',
        center: 'title',
        right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay',
    });
    const [showWeekend, setShowWeekend] = useState(false);

    useEffect(() => {
        const changeToolbarView = (obj) => {
            if (customButtons && !loading) {
                const rightButtons = obj?.right;

                obj.right = rightButtons ? `${rightButtons},createAvailabilityButton` : 'createAvailabilityButton';
            }

            setHeaderToolbar(obj);
            setToolbarLoading(false);
        };

        const handleResize = () => {
            const windowWidth = window.innerWidth;

            // if(windowWidth > 1500) {
            //     setShowWeekend(true);
            // } else {
            //     setShowWeekend(false);
            // }

            // Set toolbar based on screen size
            if (windowWidth <= hideToolbarSize) {
                changeToolbarView({
                    left: 'prev,next today',
                    center: 'title',
                })
            } else {
                changeToolbarView({
                    left: 'prev,next today',
                    center: 'title',
                    right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
                })
            }

            // If the screen size is mobile
            if (windowWidth <= MOBILE_SIZE) {
                changeToolbarView({
                    left: 'prev,next',
                    center: 'title',
                })
                setTitleFormat({ month: '2-digit', day: '2-digit' })
            } else {
                setTitleFormat({ year: 'numeric', month: 'long', day: 'numeric' })
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
    }, [customButtons, loading]);

    if (toolbarLoading) return <LoadingPage />;

    const getNewViewType = () => {
        const localStorage = window.localStorage;

        const localStorageType = localStorage.getItem(VIEW_TYPE_KEY) || 'dayGridMonth';

        const shouldHideToolbar = window.innerWidth <= hideToolbarSize;
        const isMobile = window.innerWidth <= MOBILE_SIZE;

        // If the screen size is mobile show timeGridDay
        // Otherwise if the toolbar should be hidden show timeGridWeew
        // Otherwise show localStorageType
        const newViewType = isMobile ? 'timeGridDay' : shouldHideToolbar ? 'timeGridWeek' : localStorageType;

        localStorage.setItem(VIEW_TYPE_KEY, newViewType);
        return newViewType;
    };

    return (
        <FullCalendar
            plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin, interaction, bootstrap5Plugin]}
            initialView={window.localStorage.getItem(VIEW_TYPE_KEY) || 'dayGridMonth'}
            windowResize={(e) => {
                const newViewType = getNewViewType();
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
            weekends={showWeekend}

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
            height={'auto'}
            allDayText={`${t('calendar.all_day')}`}
            allDaySlot={false}
            titleFormat={titleFormat}
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
