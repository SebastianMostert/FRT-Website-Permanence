import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getRoles } from '../utils';

export default function Header() {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const logoStyle = {
    maxHeight: '50px',
    marginRight: '10px',
    marginLeft: '10px',
  };

  useEffect(() => {
    async function fetchData() {
      const roles = await getRoles(currentUser?.IAM);
      setRoles(roles);

      setLoading(false);
    }

    fetchData();
  }, [currentUser?.IAM]);

  const isAdmin = roles?.includes('admin');
  const isMember = roles?.includes('member');
  const isLoge = roles?.includes('loge');
  const isPublic = roles?.includes('public');

  const memberLinks = [
    <Nav.Link key="calendar" as={Link} to="/calendar" className="nav-link">
      {t('header.calendar')}
    </Nav.Link>,
    <Nav.Link key="reports" as={Link} to="/reports" className="nav-link">
      {t('header.reports')}
    </Nav.Link>
  ];

  const adminOnlyLinks = [
    <Nav.Link key="admin" as={Link} to="/admin" className="nav-link">
      {t('header.admin')}
    </Nav.Link>
  ];

  const logeLinks = [
    <Nav.Link key="loge" as={Link} to="/current-situation" className="nav-link">
      {t('header.current_situation')}
    </Nav.Link>,
    <Nav.Link key="loge" as={Link} to="/incidents" className="nav-link">
      {t('header.incidents')}
    </Nav.Link>,
    <Nav.Link key="loge" as={Link} to="/members" className="nav-link">
      {t('header.members')}
    </Nav.Link>
  ];

  const publicLinks = [
    
  ];

  return (
    <Navbar expand="lg" className="shadow-sm bg-slate-200 select-none">
      <Navbar.Brand as={Link} to="/" className='navbar-brand'>
        <img src="https://i.imgur.com/Jlu1pjU.png" alt="Logo" style={logoStyle} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" className="nav-link">
            {t('header.home')}
          </Nav.Link>
          {!loading && (
            <>
              {isAdmin && adminOnlyLinks}
              {/* If Admin show all links */}
              {(isAdmin || isMember) && memberLinks}
              {(isAdmin || isLoge) && logeLinks}
              {(isAdmin || isPublic) && publicLinks}
            </>
          )}
        </Nav>
        <Nav className="ml-3 mr-3">
          {currentUser ? (
            <span>
              {t('header.logged_in_as')} <Link to="/profile" className='no-underline'>{currentUser.firstName} {currentUser.lastName}</Link>
            </span>
          ) : (
            <Nav.Link as={Link} to="/profile" className="nav-link">
              {t('header.sign_in')}
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
