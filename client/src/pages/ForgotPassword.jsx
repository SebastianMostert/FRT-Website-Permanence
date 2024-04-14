
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call your request password reset API endpoint here
      const response = await fetch('api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {message && <Alert variant="info">{message}</Alert>}

        <Button variant="primary" type="submit">
          {t('forgot_password.button')}
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
