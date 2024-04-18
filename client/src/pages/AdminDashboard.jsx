import { useState } from 'react';
import AdminSidebar from '../components/Admin/AdminSidebar';
import ShiftAvailability from '../components/ShiftAvailability';

import { NoMobilePage } from './index'
import { isMobile } from '../utils';

const AdminDashboard = () => {
    const [selectedNavItem, setSelectedNavItem] = useState('#home');

    const handleNavItemClick = (navItem) => {
        setSelectedNavItem(navItem);
    };

    if (isMobile()) return <NoMobilePage />;

    return (
        <div className="flex">
            <AdminSidebar
                selectedNavItem={selectedNavItem}
                onNavItemClick={handleNavItemClick}
            />
            <div className="ml-5">
                {selectedNavItem === '#home' && <h1> Home </h1>}
                {selectedNavItem === '#availabilities' && <ShiftAvailability selectedTable={'availabilities'} />}
                {selectedNavItem === '#overlapping' && <ShiftAvailability selectedTable={'overlapping'} />}
                {selectedNavItem === '#shifts' && <ShiftAvailability selectedTable={'shifts'} />}
            </div>
        </div>
        // <Dashboard />
    );
};

export default AdminDashboard;
