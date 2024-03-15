import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isIAMValid, isPasswordValid } from '../utils';
import { Form, Button, InputGroup, FloatingLabel, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function SignUp() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    console.log('1')
    e.preventDefault();
    try {
      setLoading(true);
      console.log('2');

      // Verify password security
      const _isPasswordValid = await isPasswordValid(formData.password);
      if (!_isPasswordValid.success) {
        setLoading(false);
        return toast.error(`${t("signup.create.failed", { reason: _isPasswordValid.message })}`);
      }
      console.log('3')

      // Verify IAM
      const _isIAMValid = await isIAMValid(formData.IAM);
      if (!_isIAMValid.success) {
        console.log('4')
        setLoading(false);
        return toast.error(`${t("signup.create.failed", { reason: _isIAMValid.message })}`);
      }
      console.log('4')

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error(`${t('signup.create.error')}`);
        setError(true);
        return;
      }
      toast.success(`${t('signup.create.success')}`);
      navigate('/sign-in');
    } catch (error) {
      toast.error(`${t('signup.create.error')}`);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>{t('signin.signup')}</h1>
      <Form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <Form.Group controlId='IAM'>
          <FloatingLabel
            label={'IAM'}
            className="mb-3"
          >
            <Form.Control
              type='text'
              placeholder={'IAM'}
              id='IAM'
              onChange={handleChange}
            />
          </FloatingLabel>
        </Form.Group>

        <div id='Names'>
          <Row>
            <Col>
              <Form.Group controlId='firstName'>
                <FloatingLabel
                  label={t('profile.first.name')}
                  className="mb-3"
                >
                  <Form.Control
                    type='text'
                    placeholder={t('profile.first.name')}
                    onChange={handleChange}
                    id='firstName'
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='lastName'>
                <FloatingLabel
                  label={t('profile.last.name')}
                  className="mb-3"
                >
                  <Form.Control
                    type='text'
                    placeholder={t('profile.last.name')}
                    onChange={handleChange}
                    id='lastName'
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>
        </div>

        <Form.Group controlId='email'>
          <FloatingLabel
            label={t('profile.email')}
            className="mb-3"
          >
            <Form.Control
              type='email'
              placeholder={t('profile.email')}
              onChange={handleChange}
              id='email'
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId='password'>
          <InputGroup className='mb-3'>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder={t('signin.password')}
              className={`bg-slate-100 p-3 rounded-lg ${showPassword ? 'text-black' : ''}`}
              onChange={handleChange}
              id='password'
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
        >
          {loading ? `${t('submit.btn.loading')}` : `${t('signin.signup')}`}
        </Button>
      </Form>

      <div className='d-flex gap-2 mt-5'>
        <p>{t('signup.haveaccount')}</p>
        <Link to='/sign-in'>
          <span className='text-blue-500'>{t('signin.title')}</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error && `${t("signin.error")}`}</p>
    </div>
  );
}
