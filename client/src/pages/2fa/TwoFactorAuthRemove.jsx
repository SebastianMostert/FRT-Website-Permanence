/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Alert, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useApiClient } from '../../contexts/ApiContext';

const TwoFactorAuthRemove = () => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const { t } = useTranslation();

    const apiClient = useApiClient();

    const handleRemove2FA = async () => {
        try {
            await apiClient.auth.twoFA.remove({
                IAM: currentUser.IAM,
                code,
                password,
            });
            // 2FA removed successfully
            setError('');
            toast.success(t('2fa.remove.success'));
        } catch (error) {
            const errorMessage = error.response.data.error;
            setError(errorMessage);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className="text-center">
                        <h3>{t('2fa.remove.title')}</h3>
                        <p>{t('2fa.remove.description')}</p>
                        <Form>
                            <div className='mb-3'>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <FloatingLabel
                                                controlId="floatingInput"
                                                label={t('2fa.remove.placeholder.totp_code')}
                                                id='code'
                                            >
                                                <Form.Control
                                                    type="text"
                                                    placeholder={t('2fa.remove.placeholder.totp_code')}
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    id="otp"
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <FloatingLabel
                                                controlId="floatingInput"
                                                label={t('2fa.remove.placeholder.password')}
                                            >
                                                <Form.Control
                                                    type="password"
                                                    placeholder={t('2fa.remove.placeholder.password')}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    id="password"
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>

                                </Row>
                            </div>
                            <Button variant="danger" onClick={handleRemove2FA}>
                                {t('2fa.remove.button')}
                            </Button>

                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container >
    );
};

export default TwoFactorAuthRemove;
