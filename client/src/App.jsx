import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Calendar from './pages/Calendar';
import { ToastContainer } from 'react-toastify';
import Report from './pages/Report';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/ErrorPages/Pages/404';
import './App.css';
import HeaderRoute from './components/HeaderRoute';
import { isSmallMobile } from './utils';
import NoMobilePage from './pages/ErrorPages/noMobilePage';

function App() {

  if (isSmallMobile()) return <NoMobilePage />
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HeaderRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path='/report' element={<Report />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/admin' element={<AdminDashboard />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        limit={4}
        closeOnClick={true}
        draggable={true}
      />
    </BrowserRouter>
  );
}

export default App;
