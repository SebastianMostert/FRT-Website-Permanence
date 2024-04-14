import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const timeInSeconds = 300;

const VerifyEmail = ({ data, onChange, onNext }) => {
  const [verificationId, setVerificationId] = useState('');
  const [remainingTime, setRemainingTime] = useState(timeInSeconds); // 5 minutes in seconds
  const [timerInterval, setTimerInterval] = useState(null);
  const { t } = useTranslation();

  // Function to generate a random ID
  const generateRandomId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const generateAndSendId = async () => {
    const id = generateRandomId(8); // Change length as needed
    setVerificationId(id);

    // Simulate sending the ID via email (replace with actual API call)
    try {
      notifyUser({
        code: id,
        time: timeInSeconds,
        email: data.email,
      });

      // Start the countdown timer
      setRemainingTime(timeInSeconds); // Reset the timer
      startTimer();
    } catch (error) {
      console.error('Failed to send ID:', error);
    }
  };

  useEffect(() => {
    generateAndSendId();
    return () => clearInterval(timerInterval);
  }, []); // Run once on component mount

  const startTimer = () => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const handleVerify = () => {
    // Here you can compare the entered ID with the generated ID
    // For demonstration, we're just showing a success message
    if (verificationId === data.verificationId) {
      toast.success(t('onboarding.verify_email.verified.success'));
      onNext();
    } else {
      toast.error(t('onboarding.verify_email.verified.error.invalid'));
    }
  };

  const notifyUser = async ({ code, time, email }) => {
    try {
      const res = await fetch('/api/v1/user/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, time, email }),
      });

      if (res.status === 200) {
        toast.success(t('onboarding.verify_email.email_sent.success'));
      } else {
        toast.error(t('onboarding.verify_email.email_sent.error'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="form-card">
            <Card.Body>
              <h1 className="text-center mb-4">{t('onboarding.verify_email.title')}</h1>
              <p className="text-center">{t('onboarding.verify_email.subtitle')} {data.email}</p>
              <Form>
                <Form.Group controlId="verificationId">
                  <Form.Label>{t('onboarding.verify_email.label.otp_code')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={data.verificationId}
                    onChange={(e) => onChange('verificationId', e.target.value)}
                    placeholder={t('onboarding.verify_email.placeholder.otp_code')}
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button onClick={handleVerify} variant="primary" className="mt-3">
                    {t('onboarding.verify_email.button.verify')}
                  </Button>
                </div>
              </Form>
              <p className="text-center mt-3">
                {t('onboarding.verify_email.remaining_time')} {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

VerifyEmail.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default VerifyEmail;
