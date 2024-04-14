import PropTypes from 'prop-types';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Notifications = ({ data, onChange, onNext }) => {
  const { t } = useTranslation();

  const handleCheckboxChange = (key, value) => {
    onChange('notifications', {
      ...data.notifications,
      [key]: value,
    });
  };

  return (
    <Container className="mt-5">
      <h1>{t('onboarding.notifications.title')}</h1>
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label={t('onboarding.notifications.shift_emails.label')}
              checked={data.notifications.shiftEmails}
              onChange={(e) => handleCheckboxChange('shiftEmails', e.target.checked)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label={t('onboarding.notifications.security_emails.label')}
              checked={data.notifications.securityEmails}
              onChange={(e) => handleCheckboxChange('securityEmails', e.target.checked)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label={t('onboarding.notifications.other_emails.label')}
              checked={data.notifications.otherEmails}
              onChange={(e) => handleCheckboxChange('otherEmails', e.target.checked)}
            />
          </Col>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={onNext}>
            {t('onboarding.button.next')}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

Notifications.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Notifications;
