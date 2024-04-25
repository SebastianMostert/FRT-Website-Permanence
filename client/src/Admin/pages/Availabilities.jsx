// Importing necessary dependencies from React and other modules
import { useEffect, useState } from 'react';
import Calendar from '../../components/Calendar/Calendar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { colors, getMember } from '../../utils';
import { toast } from 'react-toastify';

// Functional component definition for Availabilities
const Availabilities = () => {
    // State variables initialization using the useState hook
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user);
    const IAM = currentUser.IAM;
    const [calendarAvailability, setCalendarAvailability] = useState([]);

    // useEffect hook for fetching data
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const data = await getAvailabilities();
            const availabilityEvents = await getEvents(data);

            setCalendarAvailability(availabilityEvents);
            setIsLoading(false);
        }

        fetchData(); // Calling the fetchData function
    }, [IAM, currentUser, t]); // Dependency array for the useEffect hook

    // Event click handler function
    const handleEventClick = async (e) => {
        const event = e.event;
        const calendar = e.view.calendar;

        await calendar.unselect();
        if (event.extendedProps && event.extendedProps.type === 'overlap') {
            const overlapEventIds = event.extendedProps.ids;
            const overlappingAvailabilities = calendarAvailability.filter((avail) =>
                overlapEventIds.includes(avail.id)
            );
            const overlapTitles = overlappingAvailabilities.map((avail) => avail.title);

            // Toast message displaying overlapping availabilities
            toast.info(`Overlapping Availabilities (${overlapTitles.length}): ${overlapTitles.join(', ')}`, {
                autoClose: 5000, // Auto close the toast after 5 seconds
            });
        }
    };

    // Rendering the Calendar component
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

// Exporting the Availabilities component as the default export
export default Availabilities;

// Async function to fetch all the availabilities
async function getAvailabilities() {
  const res = await fetch(`/api/v1/availability/all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const dataJson = await res.json();

  if (dataJson.success === false) return [];

  // Sort availabilities by start time
  const data = dataJson.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return data;
}

// Async function to fetch availabilities data
async function getEvents(availabilities) {
  try {
    const availabilityEvents = [];

    // Looping through availabilities data
    for (let i = 0; i < availabilities.length; i++) {
      const availability = availabilities[i];

      const res = await getMember(availability.IAM);
      const user = await res.data;

      // Marking availability status
      let title = `${user.firstName} ${user.lastName}`;
      const isVerifiedAvailability = availability.confirmed;

      if (isVerifiedAvailability) {
        title = `Confirmed Availability`;
      }

      // Creating event object
      const event = {
        title,
        start: availability.startTime,
        end: availability.endTime,
        id: availability._id,
        backgroundColor: colors.events.availability,
        extendedProps: { ...availability, type: 'availability', user },
      };

      availabilityEvents.push(event);
    }

    // Returning combined availability and overlap events
    return availabilityEvents;
  } catch (error) {
    console.error(error);
    return []
  }
}