/* eslint-disable react/prop-types */
import { Card, Col } from 'react-bootstrap';
import CountUp from 'react-countup';

const StatCard = ({ title, description, value }) => {
  if (value == undefined) return null;
  
  return (
    <Col xs={12} sm={6} md={4} className="mb-4 d-flex justify-content-center">
      <Card className="p-3 shadow-sm w-100">
        <Card.Body className="d-flex flex-column align-items-center">
          <div className="text-center mb-3">
            <Card.Title>{title}</Card.Title>
            <Card.Text className="text-muted">{description}</Card.Text>
          </div>
          <div className="mt-auto">
            <Card.Text className="display-4 font-weight-bold">
              <CountUp start={0} end={value} duration={4} separator="," />
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default StatCard;
