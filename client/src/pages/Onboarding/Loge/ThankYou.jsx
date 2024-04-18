/* eslint-disable react/prop-types */
import { Container, Row, Col, Button } from 'react-bootstrap';

const ThankYou = ({ darkMode, data }) => {
    const handleContactUs = () => {
        const subject = 'Help Verify Account';
        const fullName = `${data.lastName} ${data.firstName}`;
        const body = `Dear Support Team,

I hope this email finds you well.

I am reaching out to seek assistance with verifying my account. Below are the details:

IAM: ${data.IAM}
Account Type: Loge

Your prompt attention to this matter would be greatly appreciated.

Thank you for your assistance.

Best regards,
${fullName}`;
        const emailAddress = 'frt.llis.lux@gmail.com';
        const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    };

    return (
        <Container className={`mt-5 ${darkMode ? 'text-light' : ''}`}>
            <Row className="justify-content-center">
                <Col md={10} lg={8} xl={6}>
                    <div className="text-center">
                        <h1 className="mb-5">{darkMode ? 'Thank You' : 'Thank You'}</h1>
                        <p className="lead">{darkMode ? 'We appreciate your registration!' : 'We appreciate your registration!'}</p>
                        <div className={`p-5 rounded ${darkMode ? 'bg-dark text-light' : 'bg-light'} mb-5 shadow`}>
                            <h2 className="mb-4">Next Steps</h2>
                            <p className="mb-4">Your registration has been received. Before you can access the website, it needs to be verified by an administrator. This process may take a few days.</p>
                            <p className="mb-4">Please wait for an email notification from us regarding the status of your registration.</p>
                            <p className="mb-4">If you need immediate assistance or haven't received any notification after a few days, please contact us for further assistance.</p>
                            <p className="mb-4">Please ensure you include your IAM and send it via your school email. If you do not extra verification may be required</p>
                        </div>
                        <Button variant={darkMode ? 'outline-light' : 'primary'} size="lg" onClick={handleContactUs}>Contact Us</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ThankYou;
