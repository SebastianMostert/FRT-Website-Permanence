import { useSelector } from 'react-redux'
import { NotAuthorized } from './ErrorPages/Pages/401'
import Calendar from '../components/Calendar/Calendar'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getMember } from '../utils'

const AdminDashboard = () => {
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user)
    const toastIdLoading = useRef(null);
    const IAM = currentUser.IAM;
    const [calendarAvailability, setCalendarAvailability] = useState([]);

    const roles = currentUser?.roles;

    // If user is not an admin, redirect to 401 page
    if (!roles?.includes('admin')) {
        return <NotAuthorized />
    }

    // Get all availabilities    
    useEffect(() => {
        async function fetchData() {
            toastIdLoading.current = toast.info(`${t('calendar.loading')}`, { autoClose: false });

            const calendarAvailabilities = await getAvailabilities();

            setCalendarAvailability(calendarAvailabilities);

            toast.update(toastIdLoading.current, { type: 'success', autoClose: 5000, render: `${t('calendar.loading.success')}` });
        }

        fetchData();
    }, [IAM, currentUser]);

    async function getAvailabilities() {
        try {
            const availabilityEvents = [];
            const res = await fetch(`/api/availability/all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            // Create a map to store availabilities by date
            const availabilitiesByDate = {};
            data.forEach((availability) => {
                const date = availability.startTime.split('T')[0];
                if (!availabilitiesByDate[date]) {
                    availabilitiesByDate[date] = [];
                }
                availabilitiesByDate[date].push(availability);
            });

            // Filter availabilities to show only if at least two are at the same time
            for (const dateAvailabilities of Object.values(availabilitiesByDate)) {
                if (dateAvailabilities.length >= 2) {
                    const firstAvailability = dateAvailabilities[0];
                    const secondAvailability = dateAvailabilities[1];

                    const startTime1 = new Date(firstAvailability.startTime);
                    const endTime1 = new Date(firstAvailability.endTime);

                    const startTime2 = new Date(secondAvailability.startTime);
                    const endTime2 = new Date(secondAvailability.endTime);

                    // Compare start and end times to get the overlapping slot
                    const startTime = startTime1 < startTime2 ? startTime2 : startTime1;
                    const endTime = endTime1 < endTime2 ? endTime1 : endTime2;

                    //#region Verify availability
                    const firstUserData = await getMember(firstAvailability.IAM);
                    const secondUserData = await getMember(secondAvailability.IAM);

                    if (!firstUserData.success || !secondUserData.success) {
                        toast.error(`Error verifying availability`);
                        continue; // Skip this pair of availabilities
                    }

                    const firstUser = firstUserData.data;
                    const secondUser = secondUserData.data;
                    //#endregion

                    availabilityEvents.push({
                        title: `${firstUser.firstName} ${firstUser.lastName} and ${secondUser.firstName} ${secondUser.lastName} are available (Training is not checked yet)`,
                        start: startTime,
                        end: endTime,
                    });
                }
            }

            return availabilityEvents;
        } catch (error) {
            console.log(error);
            return [];
        }
    }



    const handleEventClick = (event) => {
        console.log(event)
    }

    return (
        <div>
            <Calendar
                events={calendarAvailability}
                handleEventClick={handleEventClick}
            />
        </div>
    );
}

export default AdminDashboard;
