import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Form, Button, FormGroup } from 'react-bootstrap';

import { ForgotPassword } from '../index'
import { useApiClient } from '../../contexts/ApiContext';
import PasswordInput from '../../components/Inputs/PasswordInput';

const defaultValues = {
  IAM: '',
  password: '',
  code: '',
  rememberMe: false, // Add rememberMe property with default value false
};

export default function IAMSignIn() {
  const { t } = useTranslation();
  const toastId = React.useRef(null);

  const [formData, setFormData] = useState(defaultValues);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiClient = useApiClient();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, rememberMe: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toastId.current = toast.info(`${t('toast.sign_in.loading')}`, {
        autoClose: false,
      });
      dispatch(signInStart());

      try {
        const data = await apiClient.auth.signin({
          IAM: formData.IAM,
          password: formData.password,
          code: formData.code,
          rememberMe: formData.rememberMe, // Pass rememberMe property to the API
        });

        toast.update(toastId.current, {
          type: 'success',
          autoClose: 5000,
          render: `${t('toast.sign_in.success')}`,
        });
        dispatch(signInSuccess(data));
        // Get ?redirect= if present
        const redirect = window.location.search.split('=')[1];
        if (redirect) {
          navigate(redirect);
        } else {
          navigate('/');
        }
      } catch (error) {
        setFailedAttempts((prevAttempts) => prevAttempts + 1);
      }
    } catch (error) {
      toast.update(toastId.current, {
        type: 'error',
        autoClose: 5000,
        render: `${t('toast.sign_in.failed', { reason: error.message })}`,
      });
      dispatch(signInFailure(error));
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  useEffect(() => {
    const IAM = formData.IAM.toLocaleLowerCase();
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/fetch/2fa/IAM/${IAM}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()

        if (!res.ok) {
          if (res.status == 404) return
          toast.error(`An error occured`)
          return
        }

        setTwoFactorAuthEnabled(data);
      } catch (error) {
        toast.error(`An error occured: ${error.message}`)
        console.error(error)
      }
    }

    if (IAM.length === 8) fetchUser();
    else setTwoFactorAuthEnabled(null);
  }, [navigate, formData.IAM]);

  if (showForgotPassword) {
    return <ForgotPassword />
  } else {
    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>{t('sign_in.title')}</h1>
        <Form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Form.Group controlId='IAM'>
            <Form.Label>IAM</Form.Label>
            <Form.Control
              type='text'
              placeholder='IAM'
              className='bg-slate-100 p-3 rounded-lg'
              onChange={handleChange}
            />
          </Form.Group>
          <PasswordInput handleChange={handleChange} label={t('sign_in.password')} />
          {twoFactorAuthEnabled && (
            <Form.Group controlId='code'>
              <Form.Label>TOTP Code</Form.Label>
              <Form.Control
                type='text'
                placeholder='TOTP Code'
                className='bg-slate-100 p-3 rounded-lg'
                onChange={handleChange}
                minLength={6}
                maxLength={6}
              />
            </Form.Group>
          )}
          {/* Remember Me checkbox */}
          <FormGroup controlId='rememberMe'>
            <Form.Check
              type='checkbox'
              label='Remember Me'
              checked={formData.rememberMe}
              onChange={handleCheckboxChange}
            />
          </FormGroup>
          <Button
            variant='primary'
            type='submit'
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? `${t('button.loading')}` : `${t('sign_in')}`}
          </Button>
        </Form>
        {failedAttempts >= 1 && (
          <div className='mt-3'>
            <Button variant='link' onClick={handleForgotPassword} style={{ textDecoration: 'none' }}>
              <p className='text-red-500'>{t('forgot_password')}</p>
            </Button>
          </div>
        )}
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
    );
  }
}
