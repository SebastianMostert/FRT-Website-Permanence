/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import { apiSignOut, apiValidate, useInitialDataFetch, useWebSocketMessages } from './APICalls/apiCalls';

function TokenValidator() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  // Function to validate token
  const validateToken = async () => {
    if (currentUser) {
      const res = await apiValidate();

      if (!res.success) {
        await apiSignOut();
        dispatch(signOut());

        // Go to home page
        window.location.href = '/';
        return;
      }

      const data = res.json;

      if (!data.valid) {
        const handleSignOut = async () => {
          try {
            await apiSignOut();
            dispatch(signOut());

            // Go to home page
            window.location.href = '/';
          } catch (error) {
            console.log(error);
          }
        };

        handleSignOut();
      }
    }
  };

  useEffect(() => {
    validateToken();
  }, [location.pathname, currentUser]);

  return null;
}

function App() {
  const { currentUser} = useSelector((state) => state.user);

  useWebSocketMessages();
  useInitialDataFetch(currentUser);

  if (isTinyMobile()) return <NoMobilePage />;

  return (
    <BrowserRouter>
      <TokenValidator />
      <Routes>
        <Route element={<HeaderRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path='/reports' element={<Reports />} />
            <Route exact path="/report/:missionNumber" element={<Report />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path='/admin' element={<AdminDashboard />} />
        </Route>
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
