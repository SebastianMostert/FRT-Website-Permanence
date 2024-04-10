/* eslint-disable react/prop-types */
import { Card } from 'react-bootstrap';
import Symptoms from './SamplerComponents/Sympotms';
import Allergies from './SamplerComponents/Allergies';
import Medications from './SamplerComponents/Medications';
import PastMedicalHistory from './SamplerComponents/PastMedicalHistory';
import LastOralIntake from './SamplerComponents/LastOralIntake';
import Events from './SamplerComponents/Events';
import RiskFactors from './SamplerComponents/RiskFactors';

import { useTranslation } from 'react-i18next';
import SchemaComponentsCard from '../Inputs/SchemaComponentsCard';

const SamplerSchema = ({ samplerData, handleSamplerChange, isEditable }) => {
    const disabled = !isEditable;
    const { t } = useTranslation();

    const samplerSubComponents = {
        symptoms: {
            body: (
                <Symptoms
                    value={samplerData.symptoms}
                    onChange={handleSamplerChange}
                    isEditable={isEditable}
                />
            ),
            field: 'symptoms',
            onChange: handleSamplerChange,
            value: samplerData.symptoms,
            disabled,
            title: t('sampler.symptoms.title'),
            bg: "light"
        },
        allergies: {
            body: (
                <Allergies
                    value={samplerData.allergies}
                    onChange={handleSamplerChange}
                    isEditable={isEditable}
                />
            ),
            field: 'allergies',
            onChange: handleSamplerChange,
            value: samplerData.allergies,
            disabled,
            title: t('sampler.allergies.title'),
            bg: "info"
        },
        medications: {
            body: (
                <Medications
                    value={samplerData.medications}
                    onChange={handleSamplerChange}
                    isEditable={isEditable}
                />
            ),
            field: 'medications',
            onChange: handleSamplerChange,
            value: samplerData.medications,
            disabled,
            title: t('sampler.medications.title'),
            bg: "success"
        },
        previousMedicalHistory: {
            body: (
                <PastMedicalHistory
                    value={samplerData.pastMedicalHistory}
                    onChange={handleSamplerChange}
                    isEditable={isEditable}
                />
            ),
            field: 'pastMedicalHistory',
            onChange: handleSamplerChange,
            value: samplerData.pastMedicalHistory,
            disabled,
            title: t('sampler.past_medical_history.title'),
            bg: "warning"
        },
        lastOralIntake: {
            body: (
                <LastOralIntake
                    value={samplerData.lastOralIntake}
                    onChange={handleSamplerChange}
                    isEditable={isEditable}
                />
            ),
            field: 'lastOralIntake',
            onChange: handleSamplerChange,
            value: samplerData.lastOralIntake,
            disabled,
            title: t('sampler.last_oral_intake.title'),
            bg: "danger"
        },
        events: {
            body: (
                <Events
                    value={samplerData.events}
                    onChange={handleSamplerChange}
                    isEditable={isEditable}
                />
            ),
            field: 'events',
            onChange: handleSamplerChange,
            value: samplerData.events,
            disabled,
            title: t('sampler.events.title'),
            bg: "secondary"
        },
        riskFactors: {
            body: (
                <RiskFactors
                    value={samplerData.riskFactors}
                    onChange={handleSamplerChange}
                    isEditable={isEditable}
                />
            ),
            field: 'riskFactors',
            onChange: handleSamplerChange,
            value: samplerData.riskFactors,
            disabled,
            title: t('sampler.risk_factors.title'),
            bg: "primary"
        },
    };

    return (
        <Card.Body>
            {Object.entries(samplerSubComponents).map(([key, value]) => (
                <SchemaComponentsCard
                    key={key}
                    body={value.body}
                    field={value.field}
                    onChange={value.onChange}
                    value={value.value}
                    disabled={value.disabled}
                    title={value.title}
                    bg={value.bg}
                />
            ))}
        </Card.Body>
    );
};

export default SamplerSchema;