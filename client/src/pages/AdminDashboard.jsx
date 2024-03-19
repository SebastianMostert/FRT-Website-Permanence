import { useSelector } from 'react-redux'
import { NotAuthorized } from './ErrorPages/Pages/401'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ShiftAvailability from '../components/AvailabilityCalendar'
import NoMobilePage from './ErrorPages/Pages/NoMobilePage'
import { isMobile } from '../utils'

const AdminDashboard = () => {
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user)
    const IAM = currentUser.IAM;
    const [availabilty, setAvailability] = useState([]);
    const [shift, setShift] = useState([]);

    // Get all availabilities    
    useEffect(() => {
        async function fetchData() {
            const availabilities = await getAvailabilities(IAM);
            setAvailability(availabilities);

            const shifts = await getShifts();
            setShift(shifts);
        }

        fetchData();
    }, [IAM, currentUser, t]);

    const roles = currentUser?.roles;
    // If user is not an admin, redirect to 401 page
    if (!roles?.includes('admin')) {
        return <NotAuthorized />
    }

    if (isMobile()) {
        return (
            <NoMobilePage />
        );
    }

    return (
        <div>
            <ShiftAvailability availabilities={availabilty} shifts={shift} />
        </div>
    );
}

export default AdminDashboard;

async function getAvailabilities() {
    const res = await fetch(`/api/v1/availability/all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await res.json();

    return data;
}

async function getShifts() {
    const res = await fetch(`/api/v1/shift/fetch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = (await res.json()).data;
    return data;
}