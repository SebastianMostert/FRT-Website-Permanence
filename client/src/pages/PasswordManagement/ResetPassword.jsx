import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { isPasswordValid } from '../../utils';
import { useApiClient } from '../../contexts/ApiContext';
import PasswordInput from '../../components/Inputs/PasswordInput';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams(); // Get the token from the URL
    const { t } = useTranslation();

    const apiClient = useApiClient();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const password1valid = isPasswordValid(password, t);
        if (!password1valid.success) {
            return toast.error(password1valid.message);
        }

        const password2valid = isPasswordValid(confirmPassword, t);
        if (!password2valid.success) {
            return toast.error(password2valid.message);
        }

        if (password !== confirmPassword) {
            return toast.error(t('reset_password.error.passwords_mismatch'));
        }

        try {
            await apiClient.auth.password.reset({ token, newPassword: password });
            toast.success(t('reset_password.success'));
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(t('reset_password.error'));
            console.error(error);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="mb-4">{t('reset_password.title')}</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <PasswordInput handleChange={(e) => setConfirmPassword(e.target.value)} label={t('reset_password.new_password')} />

                                <PasswordInput handleChange={(e) => setConfirmPassword(e.target.value)} label={t('reset_password.confirm_password')} />
                                <Button variant="primary" type="submit" className="mt-3">
                                    {t('reset_password.button')}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
