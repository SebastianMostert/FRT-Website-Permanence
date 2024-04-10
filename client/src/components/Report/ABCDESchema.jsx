/* eslint-disable react/prop-types */
import { Card } from 'react-bootstrap';
import Airway from './ABCDEComponents/Airway';
import CriticalBleeding from './ABCDEComponents/CriticalBleeding';
import Breathing from './ABCDEComponents/Breathing';
import Circulation from './ABCDEComponents/Circulation';
import Disability from './ABCDEComponents/Disability';
import ExposureEnvironment from './ABCDEComponents/ExposureEnvironment';
import { useTranslation } from 'react-i18next';
import SchemaComponentsCard from '../Inputs/SchemaComponentsCard';

const ABCDESchema = ({ abcdeData, handleABCDEChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    const abcdeSubComponents = {
        criticalBleeding: {
            body: (
                <CriticalBleeding
                    value={abcdeData.criticalBleeding}
                    onChange={handleABCDEChange}
                    isEditable={isEditable}
                />
            ),
            field: 'criticalBleeding',
            onChange: handleABCDEChange,
            value: abcdeData.criticalBleeding,
            disabled,
            title: t('abcde.critical_bleeding.title'),
            bg: "light"
        },
        airway: {
            body: (
                <Airway
                    value={abcdeData.airway}
                    onChange={handleABCDEChange}
                    isEditable={isEditable}
                />
            ),
            field: 'airway',
            onChange: handleABCDEChange,
            value: abcdeData.airway,
            disabled,
            title: t('abcde.airway.title'),
            bg: "info"
        },
        breathing: {
            body: (
                <Breathing
                    value={abcdeData.breathing}
                    onChange={handleABCDEChange}
                    isEditable={isEditable}
                />
            ),
            field: 'breathing',
            onChange: handleABCDEChange,
            value: abcdeData.breathing,
            disabled,
            title: t('abcde.breathing.title'),
            bg: "success"
        },
        circulation: {
            body: (
                <Circulation
                    value={abcdeData.circulation}
                    onChange={handleABCDEChange}
                    isEditable={isEditable}
                />
            ),
            field: 'circulation',
            onChange: handleABCDEChange,
            value: abcdeData.circulation,
            disabled,
            title: t('abcde.circulation.title'),
            bg: "warning"
        },
        disability: {
            body: (
                <Disability
                    value={abcdeData.disability}
                    onChange={handleABCDEChange}
                    isEditable={isEditable}
                />
            ),
            field: 'disability',
            onChange: handleABCDEChange,
            value: abcdeData.disability,
            disabled,
            title: t('abcde.disability.title'),
            bg: "danger"
        },
        exposureEnvironment: {
            body: (
                <ExposureEnvironment
                    value={abcdeData.exposureEnvironment}
                    onChange={handleABCDEChange}
                    isEditable={isEditable}
                />
            ),
            field: 'exposureEnvironment',
            onChange: handleABCDEChange,
            value: abcdeData.exposureEnvironment,
            disabled,
            title: t('abcde.exposure_environment.title'),
            bg: "secondary"
        },
    };

    return (
        <Card.Body>
            {Object.entries(abcdeSubComponents).map(([key, value]) => {
                return (
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
                )
            })}
        </Card.Body>
    );
};

export default ABCDESchema;
