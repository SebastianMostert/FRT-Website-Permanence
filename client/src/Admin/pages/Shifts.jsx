// Importing necessary dependencies from React and other modules
import { useEffect, useState } from 'react';
import Calendar from '../../components/Calendar/Calendar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import MarkBesetztModal from '../../components/MarkBesetztModal';
import CreateShiftModal from '../../components/Modals/CreateShiftModal';
import { colors } from '../../utils';
import DeleteShiftModal from '../../components/Modals/DeleteShiftModal';

// Functional component definition for Availabilities
const Shifts = () => {
  // State variables initialization using the useState hook
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const IAM = currentUser.IAM;
  const [calendarOverlaps, setCalendarOverlaps] = useState([]);
  const [calendarShifts, setCalendarShifts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [_event, setEvent] = useState(null);
  const [showCreateShiftModal, setShowCreateShiftModal] = useState(null);
  const [showDeleteShiftModal, setShowDeleteShiftModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  // useEffect hook for fetching data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getAvailabilities();
      const shifts = await getShifts();

      const overlapEvents = getOverlapAvailabilities(data);
      const shiftEvents = getShiftEvents(shifts);

      setCalendarOverlaps(overlapEvents);
      setCalendarShifts(shiftEvents);
      setShifts(shifts);
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
      setEvent(event);
      setShowModal(true);
    } else if (event.extendedProps && event.extendedProps.type === 'shift') {
      setSelectedShift(event.extendedProps);
      setShowDeleteShiftModal(true);
    } else {
      setEvent(null);
      setShowModal(false);
    }


  };

  // Rendering the Calendar component
  return (
    <>
      <Calendar
        events={[...calendarOverlaps, ...calendarShifts]}
        handleDateClick={() => { }}
        handleEventClick={handleEventClick}
        handleSelect={() => { }}
        handleViewDidMount={() => { }}
        loading={isLoading}
        selectable={false}
        customButtons={{
          createAvailabilityButton: {
            text: `${t('calendar.button.create_shift')}`,
            click: () => {
              setShowCreateShiftModal(true);
            }
          }
        }}
      />
      <MarkBesetztModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        shifts={shifts}
        event={_event}
      />
      <CreateShiftModal
        show={showCreateShiftModal}
        handleClose={() => setShowCreateShiftModal(false)}
      />
      <DeleteShiftModal
        show={showDeleteShiftModal}
        handleClose={() => setShowDeleteShiftModal(false)}
        handleDeleteShift={deleteShift}
        shift={selectedShift}
      />
    </>
  );
};

// Exporting the Availabilities component as the default export
export default Shifts;

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

async function getShifts() {
  const res = await fetch(`/api/v1/shift/fetch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const dataJson = await res.json();
  if (dataJson.success === false) return [];

  const data = dataJson.data;

  return data;
}

function getOverlapAvailabilities(availabilities) {
  // Array to store overlapping events
  const overlaps = [];

  // If there are no availabilities or only one availability, return an empty array
  if (availabilities.length < 2) {
    return overlaps;
  }

  // Iterate through each pair of availabilities to check for overlaps
  for (let i = 0; i < availabilities.length - 1; i++) {
    const currentEvent = availabilities[i];

    // Convert start and end times to Date objects for easier comparison
    const currentStart = new Date(currentEvent.startTime);
    const currentEnd = new Date(currentEvent.endTime);

    // Check for overlap with subsequent availabilities
    for (let j = i + 1; j < availabilities.length; j++) {
      const otherEvent = availabilities[j];
      const otherStart = new Date(otherEvent.startTime);
      const otherEnd = new Date(otherEvent.endTime);

      // Calculate the start and end times of the overlap
      const overlapStart = new Date(Math.max(currentStart, otherStart));
      const overlapEnd = new Date(Math.min(currentEnd, otherEnd));

      // Check if the overlap is not empty and is within both availabilities' duration
      if (overlapStart < overlapEnd &&
        overlapStart >= currentStart && overlapEnd <= currentEnd &&
        overlapStart >= otherStart && overlapEnd <= otherEnd) {
        // Check if an overlap containing both availabilities already exists
        let existingOverlap = overlaps.find(overlap =>
          overlap.start.getTime() === overlapStart.getTime() && overlap.end.getTime() === overlapEnd.getTime()
        );

        if (!existingOverlap) {
          // Create a new overlap containing both overlapping availabilities
          overlaps.push({
            title: `Overlap`, // Title indicating overlap
            start: overlapStart, // Start time of the overlap
            end: overlapEnd, // End time of the overlap
            backgroundColor: colors.events.overlap,
            extendedProps: { type: 'overlap', ids: [currentEvent._id, otherEvent._id], events: [currentEvent, otherEvent] }, // Include IDs of both overlapping availabilities
          });
        } else {
          // Add the ID of the current and other availabilities to the existing overlap
          if (!existingOverlap.extendedProps.ids.includes(currentEvent._id)) {
            existingOverlap.extendedProps.ids.push(currentEvent._id);
            existingOverlap.extendedProps.events.push(currentEvent);
          }

          if (!existingOverlap.extendedProps.ids.includes(otherEvent._id)) {
            existingOverlap.extendedProps.ids.push(otherEvent._id);
            existingOverlap.extendedProps.events.push(otherEvent);
          }
        }
      }
    }
  }

  // Returning the array of overlapping events
  return overlaps;
}

function getShiftEvents(shifts) {
  const shiftEvents = [];

  for (let i = 0; i < shifts.length; i++) {
    const shift = shifts[i];

    const event = {
      title: shift.title,
      start: shift.startDate,
      end: shift.endDate,
      id: shift._id,
      backgroundColor: colors.events.shifts,
      extendedProps: { ...shift, type: 'shift' },
    };
    shiftEvents.push(event);
  }

  return shiftEvents;
}

async function deleteShift(id) {
  fetch(`/api/v1/shift/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}