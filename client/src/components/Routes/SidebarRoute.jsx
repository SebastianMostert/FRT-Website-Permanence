import { Outlet } from 'react-router-dom';
import Sidebar from '../../Admin/components/Sidebar';

const SidebarRoute = () => {
    return (
        <div className="sidebar-layout">
            <style>
                {`
                .sidebar-layout {
                    display: flex;
                }
                
                .sidebar {
                    flex: 0 0 250px;
                    background-color: #f8f9fa;
                    padding: 20px;
                }
                
                .content {
                    flex: 1;
                    padding: 20px;
                }
                `}
            </style>
            <Sidebar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default SidebarRoute;
