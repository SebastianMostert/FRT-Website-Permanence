import { useSelector } from 'react-redux'
import { NotAuthorized } from './ErrorPages/Pages/401'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ShiftAvailability from '../components/AvailabilityCalendar'

const AdminDashboard = () => {
    const { t } = useTranslation();
    const { currentUser } = useSelector((state) => state.user)
    const IAM = currentUser.IAM;
    const [availabilty, setAvailability] = useState([]);

    // Get all availabilities    
    useEffect(() => {
        async function fetchData() {
            const availabilities = await getAvailabilities(IAM);
            setAvailability(availabilities);
        }

        fetchData();
    }, [IAM, currentUser, t]);

    const roles = currentUser?.roles;
    // If user is not an admin, redirect to 401 page
    if (!roles?.includes('admin')) {
        return <NotAuthorized />
    }
    return (
        <div>
            <ShiftAvailability availabilities={availabilty} />
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