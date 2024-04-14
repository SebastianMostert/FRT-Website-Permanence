import { useState } from 'react';
import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group';
import { isIAMValid, isPasswordValid } from '../../utils';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Introduction from './Introduction';
import VerifyEmail from './VerifyEmail';
import BasicInfo from './BasicInfo';
import Experience from './Experience';
import Trainings from './Trainings';
import Notifications from './Notifications';
import ThankYou from './ThankYou';

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';

import { toast } from 'react-toastify';

import '../../App.css'; // Create this CSS file for transitions
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

const defaultValue = {
  email: '',
  IAM: '',
  emailVerified: false,
  firstName: '',
  lastName: '',
  experienceRTW: 0,
  experienceFR: 0,
  trainings: [],
  notifications: {
    securityEmails: false,
    shiftEmails: false,
    otherEmails: false,
  },
  onBoarded: false,
  password: '',
  studentClass: '',
};

const App = () => {
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [data, setData] = useState(defaultValue);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleNextStep = () => {
    const newStep = onboardingStep + 1;
    setOnboardingStep(newStep);
  };

  const onChange = (key, value) => {
    setData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const submitData = async () => {
    // Verify password security
    const _isPasswordValid = await isPasswordValid(data.password, t);
    if (!_isPasswordValid.success) {
      return toast.error(`${t("toast.sign_up.create.failed", { reason: _isPasswordValid.message })}`);
    }

    // Verify IAM
    const _isIAMValid = await isIAMValid(data.IAM, t);
    if (!_isIAMValid.success) {
      return toast.error(`${t("toast.sign_up.create.failed", { reason: _isIAMValid.message })}`);
    }

    const res = await fetch('/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (resData.success === false) {
      toast.error(`${t('toast.sign_up.create.error')}`);
      return;
    }
    toast.success(`${t('toast.sign_up.create.success')}`);

    signIn();
  };

  const renderOnboardingStep = () => {
    switch (onboardingStep) {
      case 1:
        return <Introduction onNext={handleNextStep} />;
      case 2:
        return <BasicInfo data={data} onChange={onChange} onNext={handleNextStep} />;
      case 3:
        return <VerifyEmail data={data} onNext={handleNextStep} onChange={onChange} />;
      case 4:
        return <Experience data={data} onChange={onChange} onNext={handleNextStep} />;
      case 5:
        return <Trainings data={data} onChange={onChange} onNext={handleNextStep} />;
      case 6:
        return <Notifications data={data} onChange={onChange} onNext={handleNextStep} />;
      case 7:
        submitData();
        return <ThankYou data={data} onChange={onChange} onNext={handleNextStep} />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    // Calculate progress based on the current step
    const currentStep = onboardingStep;
    const totalSteps = 7;

    return ((currentStep - 1) / (totalSteps - 1)) * 100; // Assuming 7 steps
  };

  const signIn = async () => {
    try {
      dispatch(signInStart()); const res = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ IAM: data.IAM, password: data.password }),
      });
      const resData = await res.json();
      if (resData.success === false) {
        dispatch(signInFailure(resData));
        return;
      }
      dispatch(signInSuccess(resData));
    } catch (error) {
      toast.error(`${t('toast.sign_in.failed', { reason: error.message })}`);
      dispatch(signInFailure(error));
    }
  }

  return (
    <div className='bg-gray-900 overflow-clip text-white select-none' style={{ minHeight: '100vh' }}>
      <ProgressBar variant='success' now={calculateProgress()} className="mb-3" />

      <TransitionGroup>
        <SwitchTransition>
          <CSSTransition
            key={onboardingStep}
            addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
            classNames='fade'
          >
            {renderOnboardingStep()}
          </CSSTransition>
        </SwitchTransition>
      </TransitionGroup>
    </div>
  );
};

export default App;