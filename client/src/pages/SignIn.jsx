import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function SignIn() {
  const { t } = useTranslation();
  const toastId = React.useRef(null);

  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toastId.current = toast.info(`${t('signin.loading')}`, {
        autoClose: false,
      });
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `${t('signin.failed', { reason: data.message })}` });
        dispatch(signInFailure(data));
        return;
      }
      toast.update(toastId.current, { type: 'success', autoClose: 5000, render: `${t('signin.success')}` });
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      toast.update(toastId.current, { type: 'error', autoClose: 5000, render: `${t('signin.failed', { reason: error.message })}` });
      dispatch(signInFailure(error));
    }
  };
  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>{t('signin.title')}</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='IAM'
            id='IAM'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder={t('signin.password')}
            id='password'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? `${t('submit.btn.loading')}` : `${t('signin.title')}`}
          </button>
        </form>
        <div className='flex gap-2 mt-5'>
          <p>{t('signin.noaccount')}</p>
          <Link to='/sign-up'>
            <span className='text-blue-500'>{t('signin.signup')}</span>
          </Link>
        </div>
        <p className='text-red-700 mt-5'>
          {error ? error.message || `${t('signin.error')}` : ''}
        </p>
      </div>
    </>
  );
}
