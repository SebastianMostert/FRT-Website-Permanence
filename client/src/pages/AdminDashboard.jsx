import { useSelector } from 'react-redux'
import { NotAuthorized } from './ErrorPages/Pages/401'
import ShiftAvailability from '../components/AvailabilityCalendar'
import NoMobilePage from './ErrorPages/Pages/NoMobilePage'
import { isMobile } from '../utils'

const AdminDashboard = () => {
    const { currentUser } = useSelector((state) => state.user)
    const roles = currentUser?.roles;

    if (!roles?.includes('admin')) return <NotAuthorized />
    if (isMobile()) return <NoMobilePage />

    return (
        <div>
            <ShiftAvailability />
        </div>
    );
}

export default AdminDashboard;