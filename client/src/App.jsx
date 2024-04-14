/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Calendar from './pages/Calendar';
import { ToastContainer } from 'react-toastify';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/ErrorPages/Pages/404';
import './App.css';
import HeaderRoute from './components/HeaderRoute';
import { isTinyMobile } from './utils';
import NoMobilePage from './pages/ErrorPages/Pages/NoMobilePage';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { signOut } from './redux/user/userSlice';
import Reports from './pages/Reports';
import Report from './pages/Report';
import ResetPassword from './pages/ResetPassword';
import TwoFactorAuth from './pages/2fa/TwoFactorAuth';

function TokenValidator() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Function to validate token
  const validateToken = async () => {
    if (currentUser) {
      const res = await fetch('/api/v1/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (!data.valid) {
        const handleSignOut = async () => {
          try {
            await fetch('/api/v1/auth/signout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            dispatch(signOut());

            // Go to home page
            window.location.href = '/';
          } catch (error) {
            console.error(error);
          }
        };

        handleSignOut();
      }
    }
  };

  useEffect(() => {
    validateToken();
  }, [currentUser]);

  return null;
}

function App() {
  if (isTinyMobile()) return <NoMobilePage />;

  return (
    <BrowserRouter>
      <TokenValidator />
      <Routes>
        <Route element={<HeaderRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route element={<PrivateRoute />}>
            <Route path='/reports' element={<Reports />} />
            <Route exact path="/report/:missionNumber" element={<Report />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/2fa' element={<TwoFactorAuth />} />
        </Route>
        <Route path='/sign-up' element={<SignUp />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        limit={4}
        closeOnClick={true}
        draggable={true}
        style={{ zIndex: 10000 }}
      />
    </BrowserRouter>
  );
}

export default App;
