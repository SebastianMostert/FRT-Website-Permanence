// Importing necessary dependencies from React and other modules
import { useEffect, useState } from 'react';
import Calendar from '../../components/Calendar/Calendar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { colors, getMember } from '../../utils';
import { toast } from 'react-toastify';
import { useApiClient } from '../../ApiContext';
import moment from 'moment';

// Functional component definition for Availabilities
const Availabilities = () => {
  // State variables initialization using the useState hook
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const IAM = currentUser.IAM;
  const [calendarAvailability, setCalendarAvailability] = useState([]);

  const apiClient = useApiClient();

  // useEffect hook for fetching data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await apiClient.availability.get();
      const availabilityEvents = await getEvents(data);

      setCalendarAvailability(availabilityEvents);
      setIsLoading(false);
    }

    fetchData(); // Calling the fetchData function
  }, [IAM, apiClient.availability, currentUser, t]); // Dependency array for the useEffect hook

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
      let color = colors.events.availability;

      // If the availability is in the past or today set the color to orange
      if (moment(availability.startTime).isSame(moment(), 'day') || moment(availability.startTime).isBefore(moment())) {
        color = colors.events.expiredAvailability;
      }

      // Creating event object
      const event = {
        title,
        start: availability.startTime,
        end: availability.endTime,
        id: availability._id,
        backgroundColor: color,
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