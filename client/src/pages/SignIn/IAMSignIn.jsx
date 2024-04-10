import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function IAMSignIn() {
  const { t } = useTranslation();
  const toastId = React.useRef(null);

  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toastId.current = toast.info(`${t('toast.sign_in.loading')}`, {
        autoClose: false,
      });
      dispatch(signInStart()); const res = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.update(toastId.current, {
          type: 'error',
          autoClose: 5000,
          render: `${t('toast.sign_in.failed', { reason: data.message })}`,
        });
        dispatch(signInFailure(data));
        return;
      }
      toast.update(toastId.current, {
        type: 'success',
        autoClose: 5000,
        render: `${t('toast.sign_in.success')}`,
      });
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      toast.update(toastId.current, {
        type: 'error',
        autoClose: 5000,
        render: `${t('toast.sign_in.failed', { reason: error.message })}`,
      });
      dispatch(signInFailure(error));
    }
  };

  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>{t('sign_in.title')}</h1>
        <Form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Form.Group controlId='IAM'>
            <Form.Control
              type='text'
              placeholder='IAM'
              className='bg-slate-100 p-3 rounded-lg'
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId='password'>
            <InputGroup className='mb-3'>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder={t('sign_in.password')}
                className={`bg-slate-100 p-3 rounded-lg ${showPassword ? 'text-black' : ''}`}
                onChange={handleChange}
              />
              <InputGroup.Text>
                <Button
                  variant='link'
                  onClick={handleShowPassword}
                >
                  {
                    showPassword ?
                      <BsEye /> : <BsEyeSlash />
                  }
                </Button>
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Button
            variant='primary'
            type='submit'
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? `${t('button.loading')}` : `${t('sign_in')}`}
          </Button>
        </Form>
        <div className='flex gap-2 mt-5'>
          <p>{t('sign_in.no_account')}</p>
          <Link to='/sign-up'>
            <span className='text-blue-500'>{t('sign_up')}</span>
          </Link>
        </div>
        <p className='text-red-700 mt-5'>
          {error ? error.message || `${t('sign_in.error')}` : ''}
        </p>
      </div>
    </>
  );
}