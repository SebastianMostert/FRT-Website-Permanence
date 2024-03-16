/* eslint-disable react/prop-types */
import { Card, Form } from 'react-bootstrap';
import Airway from './ABCDEComponents/Airway';
import CriticalBleeding from './ABCDEComponents/CriticalBleeding';
import Breathing from './ABCDEComponents/Breathing';
import Circulation from './ABCDEComponents/Circulation';
import Disability from './ABCDEComponents/Disability';
import ExposureEnvironment from './ABCDEComponents/ExposureEnvironment';

const ABCDESchema = ({ abcdeData, handleABCDEChange }) => {
    return (
        <Card.Body>
            <Form>
                <CriticalBleeding value={abcdeData.criticalBleeding} onChange={handleABCDEChange} />
                <Airway value={abcdeData.airway} onChange={handleABCDEChange} />
                <Breathing value={abcdeData.breathing} onChange={handleABCDEChange} />
                <Circulation value={abcdeData.circulation} onChange={handleABCDEChange} />
                <Disability value={abcdeData.disability} onChange={handleABCDEChange} />
                <ExposureEnvironment value={abcdeData.exposureEnvironment} onChange={handleABCDEChange} />
            </Form>
        </Card.Body>
    );
};

export default ABCDESchema;
