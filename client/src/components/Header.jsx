import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav } from 'react-bootstrap';

export default function Header() {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);

  const logoStyle = {
    maxHeight: '50px',
    marginRight: '10px',
    marginLeft: '10px',
  };

  console.log(currentUser);

  const roles = currentUser?.roles;
  // If user is not an admin, redirect to 401 page

  return (
    <Navbar expand="lg" className="shadow-sm bg-slate-200">
      <Navbar.Brand as={Link} to="/" className='navbar-brand'>
        <img src="https://i.imgur.com/Jlu1pjU.png" alt="Logo" style={logoStyle} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" className="nav-link">
            {t('header.home')}
          </Nav.Link>
          {currentUser && (
            <>
              <Nav.Link as={Link} to="/calendar" className="nav-link">
                {t('header.calendar')}
              </Nav.Link>
              <Nav.Link as={Link} to="/report" className="nav-link">
                {t('header.report')}
              </Nav.Link>

              {roles?.includes('admin') && (
                <Nav.Link as={Link} to="/admin" className="nav-link">
                  {t('header.admin')}
                </Nav.Link>
              )}
            </>
          )}
        </Nav>
        <Nav className="ml-3 mr-3">
          {currentUser ? (
            <span>
              Logged in as: <Link to="/profile" className='no-underline'>{currentUser.firstName} {currentUser.lastName}</Link>
            </span>
          ) : (
            <Nav.Link as={Link} to="/profile" className="nav-link">
              {t('header.signin')}
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
