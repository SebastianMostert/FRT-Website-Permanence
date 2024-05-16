import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, FloatingLabel, Col, Alert, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getSelectMenuClass, isIAMValid, isPasswordValid } from '../../../utils';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import Select from 'react-select';
import FullNameInput from '../../../components/Inputs/FullName';
import { useApiClient } from '../../../contexts/ApiContext';

const BasicInfo = ({ data, onChange, onNext }) => {
  const { t } = useTranslation();
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classesAPI, setClassesAPI] = useState(null);

  const apiClient = useApiClient();

  useEffect(() => {
    async function fetchData() {
      const classes = await apiClient.exam.getClasses();
      setClassesAPI(classes);
    }

    fetchData();
  }, [apiClient.exam]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSelectMenuClass(t, classesAPI); // Use your actual fetching function
        setClassOptions(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [classesAPI, t]);

  const handleNext = async () => {
    // Email validation regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Verify password security
    const _isPasswordValid = await isPasswordValid(data.password, t);
    if (!_isPasswordValid) {
      return toast.error(t("toast.sign_up.create.failed", { reason: _isPasswordValid.message }));
    }

    // Verify IAM
    const _isIAMValid = await isIAMValid(data.IAM, t);
    if (!_isIAMValid) {
      return toast.error(t("toast.sign_up.create.failed", { reason: _isPasswordValid.message }));
    }

    // Check if all required fields are filled and email is valid
    if (!data.firstName) {
      toast.error('First name is required');
      return toast.error(t('onboarding.basic_info.validation_error', { field: t('profile.firstName') }));
    }
    if (!data.lastName) {
      toast.error('Last name is required');
      return toast.error(t('onboarding.basic_info.validation_error', { field: t('profile.lastName') }));
    }
    if (!data.email || !emailRegex.test(data.email)) {
      toast.error('Email is required and must be a valid email address');
      return toast.error(t('onboarding.basic_info.validation_error', { field: t('profile.email') }));
    }
    if (!data.IAM || data.IAM.length !== 8) {
      toast.error('IAM is required and must be 8 characters long');
      return toast.error(t('onboarding.basic_info.validation_error', { field: 'IAM' }));
    }
    if (!data.password) {
      toast.error('Password is required');
      return toast.error(t('onboarding.basic_info.validation_error', { field: t('sign_in.password') }));
    }
    if (!selectedClass) {
      toast.error('Class is required');
      return toast.error(t('onboarding.basic_info.validation_error', { field: t('profile.class.label') }));
    }

    setShowError(false); // Reset error state
    onNext(); // Proceed to next step
  };


  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleClassChange = (selectedOption) => {
    setSelectedClass(selectedOption);
    onChange('studentClass', selectedOption ? selectedOption.value : null);
  };

  const handleNameChange = (e) => {
    const { value, id } = e.target;
    onChange(id, value);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: '50px', // Adjust the height as needed
    }),
  };

  return (
    <div className="d-flex justify-content-center">
      <div className='p-10 w-full'>
        <h1 className="mb-4 text-center">{t('onboarding.basic_info.title')}</h1>
        <Form>
          <FullNameInput formData={data} handleChange={handleNameChange} className='mb-3 text-gray-400' />
          <Row className="mb-3">
            <Col>
              <Form.Group controlId='email'>
                <FloatingLabel
                  label={t('profile.email')}
                  className="mb-3 text-gray-400"
                >
                  <Form.Control
                    type='email'
                    placeholder={t('profile.email')}
                    value={data.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
                    required
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='IAM'>
                <FloatingLabel
                  label="IAM"
                  className="mb-3 text-gray-400"
                >
                  <Form.Control
                    type='text'
                    placeholder="IAM"
                    value={data.IAM}
                    onChange={(e) => onChange('IAM', e.target.value)}
                    minLength={8}
                    maxLength={8}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Group controlId='password'>
              <InputGroup className='mb-3'>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('sign_in.password')}
                  className={`bg-slate-100 p-3 rounded-lg ${showPassword ? 'text-black' : ''}`}
                  onChange={(e) => onChange('password', e.target.value)}
                  value={data.password}
                  required
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
          </Row>

          <Row className="mb-3">
            <Form.Group controlId='studentClass'>
              <Form.Label>{t('profile.class.label')}</Form.Label>
              <Select
                className='text-black'
                options={classOptions}
                value={selectedClass}
                onChange={handleClassChange}
                isSearchable
                isClearable
                styles={customStyles}
                required
              />
            </Form.Group>
          </Row>

          {showError && (
            <Alert variant="danger" className="mb-3">
              {t('onboarding.basic_info.validation_error')}
            </Alert>
          )}
          <div className="d-grid">
            <Button onClick={handleNext}>{t('onboarding.button.next')}</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default BasicInfo;

BasicInfo.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    IAM: PropTypes.string,
    password: PropTypes.string,
    studentClass: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};
