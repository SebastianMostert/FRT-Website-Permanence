/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarAlt, FaListAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CollapseButton = ({ onClick, sidebarExpanded }) => (
  <div className="w-full">
    <button
      className={`collapse-button bg-gray-800 text-white p-2 border-0 rounded-md w-full ${sidebarExpanded ? 'justify-end' : 'justify-start'}`}
      onClick={onClick}
    >
      {sidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
  </div>
);

const AdminSidebar = ({ onNavItemClick }) => {
  const [selectedNav, setSelectedNav] = useState('#home');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSelectNav = (selectedKey) => {
    setSelectedNav(selectedKey);
    onNavItemClick(selectedKey);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className={`admin-sidebar bg-gray-900 text-white min-h-screen ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="p-4">
        <Nav defaultActiveKey="/" className="flex-column">
          <Nav.Item>
            <Nav.Link
              onClick={() => handleSelectNav('#home')}
              className={`nav-link d-flex align-items-center ${selectedNav === "#home" ? "active" : ""}`}
            >
              <FaTachometerAlt className="icon" />
              {sidebarExpanded && <span className="ml-2">Dashboard</span>}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/" className={`nav-link d-flex align-items-center ${selectedNav === "/" ? "active" : ""}`}>
              <FaListAlt className="icon" />
              {sidebarExpanded && <span className="ml-2">Home</span>}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              onClick={toggleSidebar}
              className="nav-link d-flex align-items-center"
            >
              <FaCalendarAlt className="icon" />
              {sidebarExpanded && <span className="ml-2">Availabilities & Shifts</span>}
            </Nav.Link>
            <div className={`ml-3 ${sidebarExpanded ? "d-block" : "d-none"}`}>
              <Nav.Link
                onClick={() => handleSelectNav('#availabilities')}
                className={`nav-link sub-link ${selectedNav === "#availabilities" ? "active" : ""}`}
              >
                {sidebarExpanded && <span className="ml-2">All Availabilities</span>}
              </Nav.Link>
              <Nav.Link
                onClick={() => handleSelectNav('#overlapping')}
                className={`nav-link sub-link ${selectedNav === "#overlapping" ? "active" : ""}`}
              >
                {sidebarExpanded && <span className="ml-2">Overlapping Availabilities</span>}
              </Nav.Link>
              <Nav.Link
                onClick={() => handleSelectNav('#shifts')}
                className={`nav-link sub-link ${selectedNav === "#shifts" ? "active" : ""}`}
              >
                {sidebarExpanded && <span className="ml-2">All Shifts</span>}
              </Nav.Link>
            </div>
          </Nav.Item>
        </Nav>
      </div>
      <div className="p-4 ">
        <CollapseButton onClick={toggleSidebar} sidebarExpanded={sidebarExpanded} />
      </div>
    </div>
  );
};

export default AdminSidebar;
