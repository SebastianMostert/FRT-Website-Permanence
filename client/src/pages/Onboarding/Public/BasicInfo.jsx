import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, FloatingLabel, Col, Alert, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isIAMValid, isPasswordValid } from '../../../utils';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const BasicInfo = ({ data, onChange, onNext }) => {
    const { t } = useTranslation();
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        if (
            data.firstName &&
            data.lastName &&
            data.email &&
            emailRegex.test(data.email) &&
            data.IAM?.length === 8
        ) {
            setShowError(false); // Reset error state
            onNext(); // Proceed to next step
        } else {
            setShowError(true); // Show error message
        }
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="d-flex justify-content-center">
            <div className='p-10 w-full'>
                <h1 className="mb-4 text-center">{t('onboarding.basic_info.title')}</h1>
                <Form>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId='firstName'>
                                <FloatingLabel
                                    label={t('profile.first_name')}
                                    className="mb-3 text-gray-400"
                                >
                                    <Form.Control
                                        type='text'
                                        placeholder={t('profile.first_name')}
                                        value={data.firstName}
                                        onChange={(e) => onChange('firstName', e.target.value)}
                                        id='firstName'
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='lastName'>
                                <FloatingLabel
                                    label={t('profile.last_name')}
                                    className="mb-3 text-gray-400"
                                >
                                    <Form.Control
                                        type='text'
                                        placeholder={t('profile.last_name')}
                                        value={data.lastName}
                                        onChange={(e) => onChange('lastName', e.target.value)}
                                        id='lastName'
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
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
                                        id='email'
                                        pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='iam'>
                                <FloatingLabel
                                    label="IAM"
                                    className="mb-3 text-gray-400"
                                >
                                    <Form.Control
                                        type='text'
                                        placeholder="IAM"
                                        value={data.IAM}
                                        onChange={(e) => onChange('IAM', e.target.value)}
                                        id='iam'
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
                                    id='password'
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
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired
};
