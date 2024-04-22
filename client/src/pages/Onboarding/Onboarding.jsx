import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group';
import { isIAMValid, isPasswordValid } from '../../utils';
import ProgressBar from 'react-bootstrap/ProgressBar';

import {
  BasicInfoMember,
  ExperienceMember,
  NotificationsMember,
  TrainingsMember,
  VerifyEmailMember,
  Introduction,
  ThankYouMember,
  BasicInfoPublic,
  VerifyEmailPublic,
  NotificationsPublic,
  ThankYouPublic,
  ThankYouLoge
} from './index';

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';

import { toast } from 'react-toastify';

import '../../App.css'; // Create this CSS file for transitions
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import RoleSelector from './RoleSelector';

const defaultValue = {
  email: null,
  IAM: null,
  firstName: '',
  lastName: '',
  experienceRTW: 0,
  experienceFR: 0,
  training: [],
  notifications: {
    securityEmails: false,
    shiftEmails: false,
    otherEmails: false,
    newsletterEmails: false,
  },
  onBoarded: true,
  password: null,
  studentClass: null,
  roles: ['Member'],
};

const App = () => {
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [data, setData] = useState(defaultValue);
  const [totalSteps, setTotalSteps] = useState(8);
  const [darkMode, setDarkMode] = useState(true); // State for dark mode
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

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // Update studentClass based on role selection
    if (data.roles[0] === 'public') {
      onChange('studentClass', 'Public');
      setTotalSteps(6);
    } else if (data.roles[0] === 'loge') {
      onChange('studentClass', 'Loge');
      setTotalSteps(5);
    }
  }, [data.roles]); // Run this effect only when data.roles changes

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
    const role = data.roles[0];

    switch (onboardingStep) {
      case 1:
        return <Introduction onNext={handleNextStep} />;
      case 2:
        return <RoleSelector darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />;
      default:
        break;
    }

    let steps;

    // Set steps based on role
    if (role === 'member') {
      steps = {
        3: <BasicInfoMember darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        4: <VerifyEmailMember darkMode={darkMode} data={data} onNext={handleNextStep} onChange={onChange} />,
        5: <ExperienceMember darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        6: <TrainingsMember darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        7: <NotificationsMember darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        8: <ThankYouMember darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
      };
    } else if (role === 'public') {
      steps = {
        3: <BasicInfoPublic darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        4: <VerifyEmailPublic darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        5: <NotificationsPublic darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        6: <ThankYouPublic darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
      };
    } else if (role === 'loge') {
      steps = {
        3: <BasicInfoPublic darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        4: <VerifyEmailPublic darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
        5: <ThankYouLoge darkMode={darkMode} data={data} onChange={onChange} onNext={handleNextStep} />,
      };
    }

    // Render the step
    const currentStepComponent = steps[onboardingStep];
    if (currentStepComponent && onboardingStep === totalSteps) {
      submitData(); // Call submitData on the last step
    }

    return currentStepComponent || null;
  };

  const calculateProgress = () => {
    // Calculate progress based on the current step
    const currentStep = onboardingStep;
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  const signIn = async () => {
    try {
      dispatch(signInStart());
      const res = await fetch('/api/v1/auth/signin', {
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
  };

  return (
    <div className={darkMode ? 'dark-bg' : 'light-bg'} style={{ minHeight: '100vh' }}>
      <ProgressBar variant='success' now={calculateProgress()} className="mb-3" />
      {/* TODO */}
      {/* <button onClick={toggleDarkMode}>Toggle Dark Mode</button> */}

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
