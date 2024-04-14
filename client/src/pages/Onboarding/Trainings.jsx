import PropTypes from 'prop-types';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Trainings = ({ data, onChange, onNext }) => {
  const { t } = useTranslation();

  return (
    <Container className="mt-5">
      <h1>{t('onboarding.trainings.title')}</h1>
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="SAP 1"
              checked={data.trainings.includes('SAP 1')}
              onChange={(e) => {
                const isChecked = e.target.checked;
                onChange('trainings', isChecked ? [...data.trainings, 'SAP 1'] : data.trainings.filter(t => t !== 'SAP 1'));
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="SAP 2"
              checked={data.trainings.includes('SAP 2')}
              onChange={(e) => {
                const isChecked = e.target.checked;
                onChange('trainings', isChecked ? [...data.trainings, 'SAP 2'] : data.trainings.filter(t => t !== 'SAP 2'));
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label={t('onboarding.trainings.first_aid.label')}
              checked={data.trainings.includes('First Aid Course')}
              onChange={(e) => {
                const isChecked = e.target.checked;
                onChange('trainings', isChecked ? [...data.trainings, 'First Aid Course'] : data.trainings.filter(t => t !== 'First Aid Course'));
              }}
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

export default Trainings;

Trainings.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};
