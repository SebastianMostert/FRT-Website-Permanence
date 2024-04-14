/* eslint-disable react/prop-types */
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Introduction = ({ onNext }) => {
    const { t } = useTranslation();

    return (
        <div className='text-center'>
            <h1 className="mb-4">{t('onboarding.introduction.title')}</h1>
            <p className="lead">{t('onboarding.introduction.description')}</p>
            <Button onClick={onNext}>{t('onboarding.button.next')}</Button>
        </div>
    );
};

export default Introduction;
