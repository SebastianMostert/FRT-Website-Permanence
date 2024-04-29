import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faUsers, faCalendar, faAngleDown, faAngleUp, faCubes } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    // State to manage visibility of sub-links
    const [showAvailabilities, setShowAvailabilities] = useState(false);

    // Function to toggle visibility of Availabilities sub-links
    const toggleAvailabilities = () => {
        setShowAvailabilities(!showAvailabilities);
    };

    return (
        <div className="select-none">
            <style>
                {`
                .sidebar {
                    height: 100vh;
                    width: 250px;
                    position: fixed;
                    top: 0;
                    left: 0;
                    background-color: #f8f9fa;
                    padding: 20px;
                    overflow-y: auto; /* Enable scrolling */
                }

                .sidebar-footer {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    width: 250px;
                }

                .content {
                    margin-left: 250px;
                    padding: 20px;
                }

                .sub-links {
                    display: ${showAvailabilities ? 'block' : 'none'};
                    padding-left: 20px;
                }

                .sub-links a {
                    display: block;
                    padding: 5px 0;
                }
                `}
            </style>

            <div className="sidebar">
                <Nav className="flex-column">
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/admin" exact>
                            <FontAwesomeIcon icon={faHome} /> Home
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={toggleAvailabilities}>
                            <FontAwesomeIcon icon={faCalendar} /> Availabilities
                            {showAvailabilities ? (
                                <FontAwesomeIcon icon={faAngleUp} className="ml-2" />
                            ) : (
                                <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
                            )}
                        </Nav.Link>
                        <div className="sub-links">
                            <Nav.Link as={NavLink} to="/admin/availabilities" exact>
                                Availabilities
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/shifts" exact>
                                Shifts
                            </Nav.Link>
                        </div>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/admin/users" exact>
                            <FontAwesomeIcon icon={faUsers} /> Users
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/admin/stock">
                            <FontAwesomeIcon icon={faCubes} /> Stock
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/admin/settings">
                            <FontAwesomeIcon icon={faCog} /> Settings
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            <div className="sidebar-footer">
                <Button variant="primary" as={NavLink} to="/">
                    Return to Website
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
