/* eslint-disable react/prop-types */
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ThankYou = ({ darkMode }) => {
    const { t } = useTranslation();

    return (
        <Container className={`mt-5 ${darkMode ? 'text-light' : ''}`}>
            <div className="text-center">
                <h1>{t('onboarding.public.thank_you.title')}</h1>
                <p>{t('onboarding.public.thank_you.subtitle')}</p>
                <p>{t('onboarding.public.thank_you.next_steps.title')}</p>
                <div className="mt-3">
                    <Link to="/">
                        <Button variant="primary">
                            {t('onboarding.public.thank_you.next_steps.button.home')}
                        </Button>
                    </Link>
                    <Link to="/2fa">
                        <Button variant="secondary" className="ms-3">
                            {t('onboarding.public.thank_you.next_steps.button.2fa')}
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    );
};

export default ThankYou;
