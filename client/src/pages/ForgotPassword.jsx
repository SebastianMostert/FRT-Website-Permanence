import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const defaultValues = {
  email: '',
  otp: '',
};

const ForgotPassword = () => {
  const [formData, setFormData] = useState(defaultValues);
  const [message, setMessage] = useState('');
  const { t } = useTranslation();
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/v1/user/fetch/2fa/email/${formData.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setTwoFactorAuthEnabled(data);

      if (!res.ok) {
        toast.error(`An error occurredsssssssssssss`);
        return;
      }

      return data;
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call fetchUser after form submission
    const res = await fetchUser();

    // Check if 2FA is enabled and code is provided
    if (res && !formData.otp) {
      toast.error('Please enter your TOTP code.');
      return;
    }

    try {
      const response = await fetch('api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(t('forgot_password.success'));
      } else {
        setMessage(t('forgot_password.error'));
      }
    } catch (error) {
      setMessage(t('forgot_password.error'));
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{t('forgot_password.title')}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>{t('forgot_password.email_label')}</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </Form.Group>
        {twoFactorAuthEnabled && (
          <Form.Group controlId='code'>
            <Form.Label>TOTP Code</Form.Label>
            <Form.Control
              type='text'
              placeholder='TOTP Code'
              className='bg-slate-100 p-3 rounded-lg'
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              minLength={6}
              maxLength={6}
              required
            />
          </Form.Group>
        )}

        {message && <Alert variant="info">{message}</Alert>}

        <Button variant="primary" type="submit">
          {t('forgot_password.button')}
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
