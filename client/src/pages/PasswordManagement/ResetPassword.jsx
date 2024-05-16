import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { isPasswordValid } from '../../utils';
import { useApiClient } from '../../contexts/ApiContext';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams(); // Get the token from the URL
    const { t } = useTranslation();

    const apiClient = useApiClient();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pasword1valid = isPasswordValid(password, t);
        if (!pasword1valid.success) {
            return toast.error(pasword1valid.message);
        }

        const pasword2valid = isPasswordValid(confirmPassword, t);
        if (!pasword2valid.success) {
            return toast.error(pasword2valid.message);
        }

        if (password !== confirmPassword) return toast.error(t('reset_password.error.passwords_mismatch'));

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
        <div className="container mt-5">
            <h2 className="mb-4">{t('reset_password.title')}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="password">
                    <Form.Label>{t('reset_password.new_password')}</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                    <Form.Label>{t('reset_password.confirm_password')}</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {t('reset_password.button')}
                </Button>
            </Form>
        </div>
    );
};

export default ResetPassword;
