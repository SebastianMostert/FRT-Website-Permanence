import PropTypes from 'prop-types';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Experience = ({ data, onChange, onNext }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <div className="mt-5">
        <h1>{t('onboarding.experience.title')}</h1>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>{t('onboarding.experience.RTW.label')}</Form.Label>
              <Form.Control
                type="number"
                value={data.experienceRTW}
                onChange={(e) => onChange('experienceRTW', e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>{t('onboarding.experience.FR.label')}</Form.Label>
              <Form.Control
                type="number"
                value={data.experienceFR}
                onChange={(e) => onChange('experienceFR', e.target.value)}
              />
            </Form.Group>
          </Row>
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={onNext}>
              {t('onboarding.button.next')}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Experience;

Experience.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};
