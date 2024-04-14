/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button, Form, Image, Alert, Container, Row, Col, InputGroup, FloatingLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const TwoFactorAuthSetup = () => {
    const [code, setCode] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const { t } = useTranslation();

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const response = await axios.post('/api/v1/auth/2fa/add', {
                    iam: currentUser.IAM,
                });
                setQrCode(response.data.dataUrl);
                setError('');
            } catch (err) {
                const errorMsg = err.response.data.error;
                console.error(errorMsg);
                setError(errorMsg);
            }
        };

        generateQRCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleValidateCode = async () => {
        try {
            await axios.post('/api/v1/auth/2fa/validate', {
                iam: currentUser.IAM,
                code,
            });
            // Code is validated, you can now redirect or show a success message
            setError('');
            toast.success(t('2fa.setup.success'));
        } catch (error) {
            setError(t('2fa.setup.invalid_code'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        handleValidateCode();
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    {qrCode ? (
                        <div className="text-center">
                            <h3>{t('2fa.setup.title')}</h3>
                            <Image src={qrCode} alt="QR Code" fluid className="w-50 h-auto mx-auto mb-3" />
                            <p>{t('2fa.setup.description')}</p>
                            <Form onSubmit={handleSubmit}>
                                <InputGroup>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label={t('2fa.setup.placeholder.totp_code')}
                                    >
                                        <Form.Control
                                            type="text"
                                            placeholder={t('2fa.setup.placeholder.totp_code')}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                        />
                                    </FloatingLabel>
                                    <Button variant="primary" onClick={handleValidateCode}>
                                        {t('2fa.setup.button')}
                                    </Button>
                                </InputGroup>
                                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                            </Form>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h3>{t('2fa.setup.generate_qr')}</h3>
                            <p>{t('2fa.setup.generateing_qr')}</p>
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default TwoFactorAuthSetup;
