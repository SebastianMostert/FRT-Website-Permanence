import { useEffect, useState } from 'react';
import Calendar from '../../components/Calendar/Calendar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getMember } from '../../utils';

const Availabilities = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user);
    const IAM = currentUser.IAM;
    const [calendarAvailability, setCalendarAvailability] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const calendarAvailabilities = await getAvailabilities(IAM);
            setCalendarAvailability(calendarAvailabilities);

            setIsLoading(false);
        }

        fetchData();
    }, [IAM, currentUser, t]);

    const handleEventClick = async (e) => {
        const event = e.event;
        const calendar = e.view.calendar;

        await calendar.unselect();
        if (event.extendedProps && event.extendedProps.type === 'overlap') {
            const overlapEventIds = event.id.split('-');
            const overlappingAvailabilities = calendarAvailability.filter((avail) =>
                overlapEventIds.includes(avail.id)
            );
            const overlapIds = overlappingAvailabilities.map((avail) => avail.id);
            alert(`Overlapping Availabilities IDs: ${overlapIds.join(', ')}`);
        }
    };

    return (
        <Calendar
            events={calendarAvailability}
            handleDateClick={() => { }}
            handleEventClick={handleEventClick}
            handleSelect={() => { }}
            handleViewDidMount={() => { }}
            loading={isLoading}
            selectable={false}
        />
    );
};

export default Availabilities;

async function getAvailabilities() {
    try {
        const res = await fetch(`/api/v1/availability/all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();

        // Sort availabilities by start time
        data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        const availabilityEvents = [];

        for (let i = 0; i < data.length; i++) {
            const availability = data[i];

            const res = await getMember(availability.IAM);
            const user = await res.data;

            // Mark as available
            let title = `${user.firstName} ${user.lastName} Available`;
            const isVerifiedAvailability = availability.confirmed;

            // If true, mark as in service/working/availability confirmed
            if (isVerifiedAvailability) {
                title = `Confirmed Availability`;
            }

            const event = {
                title,
                start: availability.startTime,
                end: availability.endTime,
                id: availability._id,
                backgroundColor: isVerifiedAvailability ? '#00FF00' : '#0000FF',
                extendedProps: { ...availability, type: 'availability', user },
            };

            // Check for overlap with previous events
            let overlaps = [];
            for (let j = 0; j < availabilityEvents.length; j++) {
                const prevEvent = availabilityEvents[j];
                if (new Date(prevEvent.end) > new Date(event.start)) {
                    const overlapStart = new Date(event.start) > new Date(prevEvent.start) ? event.start : prevEvent.start;
                    const overlapEnd = new Date(event.end) < new Date(prevEvent.end) ? event.end : prevEvent.end;

                    if (overlapStart < overlapEnd) {
                        overlaps.push({
                            title: `Overlap`,
                            start: overlapStart,
                            end: overlapEnd,
                            id: `${prevEvent.id}-${event.id}`, // Combine IDs for unique ID
                            backgroundColor: '#00FF00', // Mark the overlap as green
                            extendedProps: { type: 'overlap' },
                        });
                    }
                }
            }

            availabilityEvents.push(event);
            availabilityEvents.push(...overlaps);
        }

        return availabilityEvents;
    } catch (error) {
        console.error(error);
    }
}
