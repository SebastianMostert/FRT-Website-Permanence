/* eslint-disable react/prop-types */
import { Card } from 'react-bootstrap';
import Airway from './ABCDEComponents/Airway';
import CriticalBleeding from './ABCDEComponents/CriticalBleeding';
import Breathing from './ABCDEComponents/Breathing';
import Circulation from './ABCDEComponents/Circulation';
import Disability from './ABCDEComponents/Disability';
import ExposureEnvironment from './ABCDEComponents/ExposureEnvironment';

const ABCDESchema = ({ abcdeData, handleABCDEChange, isEditable }) => {
    return (
        <Card.Body>
            <Card bg="light" className="mb-3">
                <Card.Header as="h5">Critical Bleeding</Card.Header>
                <Card.Body>
                    <CriticalBleeding value={abcdeData.criticalBleeding} onChange={handleABCDEChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="info" className="mb-3">
                <Card.Header as="h5">Airway</Card.Header>
                <Card.Body>
                    <Airway value={abcdeData.airway} onChange={handleABCDEChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="success" className="mb-3">
                <Card.Header as="h5">Breathing</Card.Header>
                <Card.Body>
                    <Breathing value={abcdeData.breathing} onChange={handleABCDEChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="warning" className="mb-3">
                <Card.Header as="h5">Circulation</Card.Header>
                <Card.Body>
                    <Circulation value={abcdeData.circulation} onChange={handleABCDEChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="danger" className="mb-3">
                <Card.Header as="h5">Disability</Card.Header>
                <Card.Body>
                    <Disability value={abcdeData.disability} onChange={handleABCDEChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="secondary" className="mb-3">
                <Card.Header as="h5">Exposure Environment</Card.Header>
                <Card.Body>
                    <ExposureEnvironment value={abcdeData.exposureEnvironment} onChange={handleABCDEChange} isEditable={isEditable} />
                </Card.Body>
            </Card>
        </Card.Body>
    );
};

export default ABCDESchema;
