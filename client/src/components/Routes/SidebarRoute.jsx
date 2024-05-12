import { Outlet } from 'react-router-dom';
import Sidebar from '../../Admin/components/Sidebar';

const SidebarRoute = () => {
    return (
        <Sidebar>
            <Outlet />
        </Sidebar>
    );
};

export default SidebarRoute;
