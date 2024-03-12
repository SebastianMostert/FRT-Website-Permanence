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
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/ErrorPages/Pages/404';

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
          <Route path='*' element={<NotFoundPage />} />
          <Route element={<PrivateRoute />}>
            {/* protected routes */}
            <Route path='/report' element={<Report />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/admin' element={<AdminDashboard />} />
          </Route>



          {/* 
          <Route path="/orders" element={<Orders />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/customers" element={<Customers />} />

          <Route path="/kanban" element={<Kanban />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/color-picker" element={<ColorPicker />} />

          <Route path="/line" element={<Line />} />
          <Route path="/area" element={<Area />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/color-mapping" element={<ColorMapping />} />
          <Route path="/pyramid" element={<Pyramid />} />
          <Route path="/stacked" element={<Stacked />} />
           */}
        </Routes>
      </BrowserRouter>
      <ToastContainer
        limit={4}
      />
    </>
  );
}
