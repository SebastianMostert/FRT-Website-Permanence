/* eslint-disable react/prop-types */
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ThankYou = ({ darkMode }) => {
  const { t } = useTranslation();

  return (
    <Container className={`mt-5 ${darkMode ? 'text-light bg-dark' : ''}`}>
      <div className="text-center">
        <h1>{t('onboarding.thank_you.title')}</h1>
        <p>{t('onboarding.thank_you.subtitle')}</p>
        <p>{t('onboarding.thank_you.next_steps.title')}</p>
        <div className="mt-3">
          <Link to="/calendar">
            <Button variant={darkMode ? "outline-light" : "primary"}>
              {t('onboarding.thank_you.next_steps.button.calendar')}
            </Button>
          </Link>
          <Link to="/2fa">
            <Button variant={darkMode ? "outline-light" : "secondary"} className="ms-3">
              {t('onboarding.thank_you.next_steps.button.2fa')}
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default ThankYou;
