/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faClock, faHandHoldingDollar, faLocationDot, faTruckMedical, faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AiFillAlert } from "react-icons/ai";
import { Slider } from '@mui/material';
import { useState } from 'react';

const MissionInformation = ({ isEditable, missionInfo, handleMissionInfoChange }) => {
    const [gravity, setGravity] = useState(missionInfo.urgenceLevel);
    const { t } = useTranslation();
    const disabled = !isEditable;

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

    function getTextAreaRows(text) {
        const length = text.split('\n').length;
        // Ensure that the textarea does not have more than 10 lines

        return length > 10 ? 10 : length;
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label style={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faClipboard} style={{ marginRight: '5px' }} /> {t('mission_information.quick_report.label')}
            </Form.Label>
            <Form.Control
                as="textarea"
                rows={getTextAreaRows(missionInfo.quickReport)}
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
            {/* Make the rows dynamically size */}
            <Form.Control
                as="textarea"
                rows={getTextAreaRows(missionInfo.valuablesGivenTo)}
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
                disabled={disabled}
            />

            <hr />

            <InputGroup>
                <Form.Label>
                    <FontAwesomeIcon icon={faUserNurse} /> {t('mission_information.sepas_contacted.label')}
                </Form.Label>
                <Form.Check
                    type="switch"
                    onChange={() => handleMissionInfoChange({ target: { name: 'sepasContacted', value: !missionInfo.sepasContacted } })}
                    checked={missionInfo.sepasContacted}
                    disabled={disabled}
                />
            </InputGroup>

            <InputGroup>
                <Form.Label>
                    <FontAwesomeIcon icon={faTruckMedical} /> {t('mission_information.ambulance_on_site.label')}
                </Form.Label>
                <Form.Check
                    type="switch"
                    onChange={() => handleMissionInfoChange({ target: { name: 'ambulanceCalled', value: !missionInfo.ambulanceCalled } })}
                    checked={missionInfo.ambulanceCalled}
                    disabled={disabled}
                />
            </InputGroup>
            <hr />
            {/* Now add the times */}
            {/* Call time - The time the team was called */}
            {/* Response time - The time the team took over the call */}
            {/* On site time - The time the team was on site */}
            {/* Finished time - The time the team finished with the patient */}
            {/* Free on radio - The time the team was free on radio */}
            {/* Now display the times */}
            <Form.Label style={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '5px' }} /> {t('mission_information.times.label')}
            </Form.Label>
            <MissionTimes value={missionInfo} onChange={handleMissionInfoChange} disabled={disabled} />
        </Form.Group>
    );
};

export default MissionInformation;

const MissionTimes = ({ value, onChange, disabled }) => {
    const { t } = useTranslation();
    const changeTime = (field, time) => {
        onChange({
            target: {
                name: field,
                value: time
            }
        });
    };

    return (
        <div>
            <Form.Group className="mb-3">
                <Form.Label>{t('mission_information.call_time.label')}</Form.Label>
                <Form.Control
                    type="time"
                    value={value.callTime}
                    onChange={(e) => changeTime('callTime', e.target.value)}
                    disabled={disabled}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('mission_information.response_time.label')}</Form.Label>
                <Form.Control
                    type="time"
                    value={value.responseTime}
                    onChange={(e) => changeTime('responseTime', e.target.value)}
                    disabled={disabled}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('mission_information.on_site_time.label')}</Form.Label>
                <Form.Control type="time" value={value.onSiteTime} onChange={(e) => changeTime('onSiteTime', e.target.value)} disabled={disabled} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('mission_information.finished_time.label')}</Form.Label>
                <Form.Control
                    type="time"
                    value={value.finishedTime}
                    onChange={(e) => changeTime('finishedTime', e.target.value)}
                    disabled={disabled}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('mission_information.free_on_radio.label')}</Form.Label>
                <Form.Control
                    type="time"
                    value={value.freeOnRadio}
                    onChange={(e) => changeTime('freeOnRadio', e.target.value)}
                    disabled={disabled}
                />
            </Form.Group>
        </div>
    );
}
