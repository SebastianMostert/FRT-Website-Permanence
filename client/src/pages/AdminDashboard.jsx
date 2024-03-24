import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NotAuthorized } from './ErrorPages/Pages/401';
import AdminSidebar from '../components/Admin/AdminSidebar';
import ShiftAvailability from '../components/ShiftAvailability';
import NoMobilePage from './ErrorPages/Pages/NoMobilePage';
import { isMobile } from '../utils';

const AdminDashboard = () => {
    const { currentUser } = useSelector((state) => state.user);
    const roles = currentUser?.roles;

    const [selectedNavItem, setSelectedNavItem] = useState('#home');

    const handleNavItemClick = (navItem) => {
        setSelectedNavItem(navItem);
    };

    if (!roles?.includes('admin')) return <NotAuthorized />;
    if (isMobile()) return <NoMobilePage />;

    return (
        <div className="flex">
            <AdminSidebar
                selectedNavItem={selectedNavItem}
                onNavItemClick={handleNavItemClick}
            />
            <div className="ml-5">
                {selectedNavItem === '#home' && <h1> Home </h1>}
                {selectedNavItem === '#availabilities' && <ShiftAvailability selectedTable={'availabilities'}/>}
                {selectedNavItem === '#overlapping' && <ShiftAvailability selectedTable={'overlapping'}/>}
                {selectedNavItem === '#shifts' && <ShiftAvailability selectedTable={'shifts'}/>}
            </div>
        </div>
    );
};

export default AdminDashboard;
