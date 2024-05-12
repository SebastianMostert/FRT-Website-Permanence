/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faHandHoldingDollar, faLocationDot, faTruckMedical, faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AiFillAlert } from "react-icons/ai";
import { Slider } from '@mui/material';
import { useState } from 'react';

const MissionInformation = ({ isEditable, missionInfo, handleMissionInfoChange }) => {
    const [gravity, setGravity] = useState(missionInfo.urgenceLevel);
    const { t } = useTranslation();
    const disabled = !isEditable;
    console.log(missionInfo);


    const handleSliderChange = (newValue) => {
        setGravity(newValue);
        handleMissionInfoChange({
            target: {
                name: 'urgenceLevel',
                value: newValue
            }
        });
    };

    const marks = [
        {
            value: 0,
            label: 'U4',
        },
        {
            value: 1,
            label: 'U3',
        },
        {
            value: 2,
            label: 'U2',
        },
        {
            value: 3,
            label: 'U1',
        },
    ];

    function valuetext(level) {
        return `U${level}`;
    }

    function valueLabelFormat(level) {
        let msg;

        switch (level) {
            case 4:
                msg = `Low level Emergency`;
                break;
            case 3:
                msg = `Medium level Emergency`;
                break;
            case 2:
                msg = `High level Emergency`;
                break;
            case 1:
                msg = `Critical level Emergency`;
                break;
        }
        return msg;
    }

    function valueToLevel(value) {
        const level = value === 0 ? 4 : value === 1 ? 3 : value === 2 ? 2 : 1;
        return level;
    }

    function levelToValue(level) {
        const value = level === 4 ? 0 : level === 3 ? 1 : level === 2 ? 2 : 3;
        return value;
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label style={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faClipboard} style={{ marginRight: '5px' }} /> {t('mission_information.quick_report.label')}
            </Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={missionInfo.quickReport}
                onChange={(e) => handleMissionInfoChange(e)}
                name="quickReport"
                disabled={disabled}
            />

            <Form.Label style={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '5px' }} /> {t('mission_information.location.label')}
            </Form.Label>
            <Form.Control
                type="text"
                value={missionInfo.location}
                onChange={(e) => handleMissionInfoChange(e)}
                name="location"
                disabled={disabled}
            />

            <Form.Label style={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faHandHoldingDollar} style={{ marginRight: '5px' }} /> {t('mission_information.valuables_given_to.label')}
            </Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={missionInfo.valuablesGivenTo}
                onChange={(e) => handleMissionInfoChange(e)}
                name="valuablesGivenTo"
                disabled={disabled}
            />

            <Form.Label style={{ display: 'flex', alignItems: 'center' }}>
                <AiFillAlert style={{ marginRight: '5px' }} /> {t('mission_information.urgence_level.label')}
            </Form.Label>
            <Slider
                aria-labelledby="track-inverted-slider"
                getAriaValueText={(value) => valuetext(valueToLevel(value))}
                defaultValue={0}
                value={levelToValue(gravity)}
                valueLabelDisplay='auto'
                valueLabelFormat={(value) => valueLabelFormat(valueToLevel(value))}
                onChange={(e, value) => handleSliderChange(valueToLevel(value))}
                marks={marks}
                min={0}
                max={3}
            />

            <InputGroup>
                <Form.Label>
                    <FontAwesomeIcon icon={faUserNurse} /> {t('mission_information.sepas_contacted.label')}
                </Form.Label>
                <Form.Check
                    type="switch"
                    onChange={() => handleMissionInfoChange({ name: 'sepasContacted', value: !missionInfo.sepasContacted })}
                    checked={missionInfo.sepasContacted}
                />
            </InputGroup>

            <InputGroup>
                <Form.Label>
                    <FontAwesomeIcon icon={faTruckMedical} /> {t('mission_information.ambulance_on_site.label')}
                </Form.Label>
                <Form.Check
                    type="switch"
                    onChange={() => handleMissionInfoChange({ name: 'ambulanceCalled', value: !missionInfo.ambulanceCalled })}
                    checked={missionInfo.ambulanceCalled}
                />
            </InputGroup>
        </Form.Group>
    );
};

export default MissionInformation;
