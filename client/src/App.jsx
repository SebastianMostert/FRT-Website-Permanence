/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MemberRoute from './components/Routes/MemberRoute';
import { ToastContainer } from 'react-toastify';
import './App.css';
import HeaderRoute from './components/Routes/HeaderRoute';
import SidebarRoute from './components/Routes/SidebarRoute';
import AdminRoute from './components/Routes/AdminRoute';
import LoggedInRoute from './components/Routes/LoggedInRoute';
import LogeRoute from './components/Routes/LogeRoute';
import { isTinyMobile, userExists } from './utils';
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
import AdminSettings from './Admin/pages/AdminSettings';
import CurrentSituation from './pages/LogePages/CurrentSituation';
import Incidents from './pages/LogePages/Incidents';
import IncidentCreate from './pages/LogePages/IncidentCreate';
import Stock from './Admin/pages/Stock/Stock';
import MembersPage from './pages/LogePages/MembersPage';
import Settings from './pages/Settings';
import { useApiClient } from './contexts/ApiContext';

function TokenValidator() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const apiClient = useApiClient();

  // Function to validate token
  const validateToken = async () => {
    const data = await apiClient.auth.validate();

    if (!data.valid) handleSignOut();
  };

  const exists = async (IAM) => {
    const doesExists = await userExists(IAM);
    if (!doesExists) handleSignOut();
  };

  const handleSignOut = async () => {
    try {
      await apiClient.auth.signout();
      dispatch(signOut());

      // Get the current 
      // Go to home page
      window.location.href = `/sign-in?redirect=${window.location.pathname}`;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      validateToken();
      exists(currentUser.IAM);
    }
  }, [currentUser]);

  return null;
}

function App() {
  if (isTinyMobile()) return <NoMobilePage />;

  return (
    <BrowserRouter>
      <TokenValidator />
      <Routes>
        <Route element={<LogeRoute />}>
          <Route element={<HeaderRoute />}>
            <Route path='/current-situation' element={<CurrentSituation />} />
            <Route path='/members' element={<MembersPage />} />
            <Route path='/incidents' element={<Incidents />} />
            <Route path='/incidents/create' element={<IncidentCreate />} />
          </Route>
        </Route>

        {/* All the Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<SidebarRoute />}>
            <Route path='/admin' element={<Dashboard />} />
            <Route path='/admin/users' element={<Users />} />
            <Route path='/admin/availabilities' element={<Availabilities />} />
            <Route path='/admin/shifts' element={<Shifts />} />
            <Route path='/admin/settings' element={<AdminSettings />} />
            <Route path='/admin/stock' element={<Stock />} />
          </Route>
        </Route>

        {/* All these Routes have a Header */}
        <Route element={<HeaderRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route element={<MemberRoute />}>
            <Route path='/reports' element={<Reports />} />
            <Route exact path="/report/:missionNumber" element={<Report />} />
            <Route path='/calendar' element={<Calendar />} />
          </Route>
          <Route element={<LoggedInRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
        </Route>

        {/* The 2 factor auth route */}
        <Route element={<MemberRoute />}>
          <Route path='/2fa' element={<TwoFactorAuth />} />
        </Route>

        {/* Various Routes */}
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
