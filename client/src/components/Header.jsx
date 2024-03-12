import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link className='remove-link-decoration' to='/'>
          {/* <h1 className='font-bold'>First Responder Team - LLIS</h1> */}
          <img src="https://i.imgur.com/6s840fb_d.png" alt='Logo' className='h-12 w-12 rounded-full object-cover' />
        </Link>
        <ul className='flex gap-4'>
          <Link className='remove-link-decoration' to='/'>
            <li>Home</li>
          </Link>
          {currentUser && <Link className='remove-link-decoration' to='/calendar'><li>Calendar</li></Link>}
          {currentUser && <Link className='remove-link-decoration' to='/report'><li>Report</li></Link>}
          {currentUser && <Link className='remove-link-decoration' to='/admin'><li>Admin</li></Link>}
          <Link className='remove-link-decoration' to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
