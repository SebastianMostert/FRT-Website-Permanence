import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link className='remove-link-decoration' to='/'>
          {/* <h1 className='font-bold'>First Responder Team - LLIS</h1> */}
          <img src="https://i.imgur.com/Jlu1pjU.png" alt='Logo' className='h-20 rounded-lg' />
        </Link>
        <ul className='flex gap-4'>
          <Link className='remove-link-decoration' to='/'>
            <li>{t('header.home')}</li>
          </Link>
          {currentUser && <Link className='remove-link-decoration' to='/calendar'><li>{t('header.calendar')}</li></Link>}
          {currentUser && <Link className='remove-link-decoration' to='/report'><li>{t('header.report')}</li></Link>}
          {currentUser && <Link className='remove-link-decoration' to='/admin'><li>{t('header.admin')}</li></Link>}
          <Link className='remove-link-decoration' to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>{t('header.signin')}</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
