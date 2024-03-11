import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Calendar from './pages/Calendar';
import { ToastContainer } from 'react-toastify';
import Report from './pages/Report';

export default function App() {
  return (
    <>
      <BrowserRouter>
        {/* header */}
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />

          {/* <Route path='/about' element={<About />} /> */}
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            {/* protected routes */}
            <Route path='/report' element={<Report />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        limit={4}
      />
    </>
  );
}
