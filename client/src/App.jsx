/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Routes/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import './App.css';
import HeaderRoute from './components/Routes/HeaderRoute';
import SidebarRoute from './components/Routes/SidebarRoute';
import { isTinyMobile } from './utils';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { signOut } from './redux/user/userSlice';

import {
  Reports,
  Report,
  ResetPassword,
  TwoFactorAuth,
  NotFoundPage,
  NoMobilePage,
  Home,
  SignIn,
  SignUp,
  Profile,
  Calendar,
} from './pages/index'

import Dashboard from './Admin/pages/Dashboard';
import Users from './Admin/pages/Users';
import Availabilities from './Admin/pages/Availabilities';
import Shifts from './Admin/pages/Shifts';
import Settings from './Admin/pages/Settings';

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
        <Route element={<SidebarRoute />}>
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/users' element={<Users />} />
          <Route path='/admin/availabilities' element={<Availabilities />} />
          <Route path='/admin/shifts' element={<Shifts />} />
          <Route path='/admin/settings' element={<Settings />} />
        </Route>
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
