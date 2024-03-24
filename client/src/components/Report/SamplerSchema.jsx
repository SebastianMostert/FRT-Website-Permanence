/* eslint-disable react/prop-types */
import { Card } from 'react-bootstrap';
import Symptoms from './SamplerComponents/Sympotms';
import Allergies from './SamplerComponents/Allergies';
import Medications from './SamplerComponents/Medications';
import PastMedicalHistory from './SamplerComponents/PastMedicalHistory';
import LastOralIntake from './SamplerComponents/LastOralIntake';
import Events from './SamplerComponents/Events';
import RiskFactors from './SamplerComponents/RiskFactors';

const SamplerSchema = ({ samplerData, handleSamplerChange, isEditable }) => {
    return (
        <Card.Body>
            <Card bg="light" className="mb-3">
                <Card.Header as="h5">Symptoms</Card.Header>
                <Card.Body>
                    <Symptoms value={samplerData.symptoms} onChange={handleSamplerChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="info" className="mb-3">
                <Card.Header as="h5">Allergies</Card.Header>
                <Card.Body>
                    <Allergies value={samplerData.allergies} onChange={handleSamplerChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="success" className="mb-3">
                <Card.Header as="h5">Medications</Card.Header>
                <Card.Body>
                    <Medications value={samplerData.medications} onChange={handleSamplerChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="warning" className="mb-3">
                <Card.Header as="h5">Past Medical History</Card.Header>
                <Card.Body>
                    <PastMedicalHistory value={samplerData.pastMedicalHistory} onChange={handleSamplerChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="danger" className="mb-3">
                <Card.Header as="h5">Last Meal</Card.Header>
                <Card.Body>
                    <LastOralIntake value={samplerData.lastOralIntake} onChange={handleSamplerChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="secondary" className="mb-3">
                <Card.Header as="h5">Events</Card.Header>
                <Card.Body>
                    <Events value={samplerData.events} onChange={handleSamplerChange} isEditable={isEditable} />
                </Card.Body>
            </Card>

            <Card bg="primary" className="mb-3">
                <Card.Header as="h5">Risk Factors</Card.Header>
                <Card.Body>
                    <RiskFactors value={samplerData.riskFactors} onChange={handleSamplerChange} isEditable={isEditable} />
                </Card.Body>
            </Card>
        </Card.Body>
    );
};

export default SamplerSchema;