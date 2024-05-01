/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faHandHoldingDollar, faLocationDot, faTruckMedical, faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MissionInformation = ({ isEditable, missionInfo, handleMissionInfoChange }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    return (
        <Form.Group className="mb-3">
            <Form.Label>
                <FontAwesomeIcon icon={faClipboard} /> {t('mission_information.quick_report.label')}
            </Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={missionInfo.quickReport}
                onChange={(e) => handleMissionInfoChange(e)}
                name="quickReport"
                disabled={disabled}
            />

            <Form.Label>
                <FontAwesomeIcon icon={faLocationDot} /> {t('mission_information.location.label')}
            </Form.Label>
            <Form.Control
                type="text"
                value={missionInfo.location}
                onChange={(e) => handleMissionInfoChange(e)}
                name="location"
                disabled={disabled}
            />

            <Form.Label>
                <FontAwesomeIcon icon={faHandHoldingDollar} /> {t('mission_information.valuables_given_to.label')}
            </Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={missionInfo.valuablesGivenTo}
                onChange={(e) => handleMissionInfoChange(e)}
                name="valuablesGivenTo"
                disabled={disabled}
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
                    onChange={() => handleMissionInfoChange({ name: 'ambulanceOnSite', value: !missionInfo.ambulanceOnSite })}
                    checked={missionInfo.ambulanceOnSite}
                />
            </InputGroup>
        </Form.Group>
    );
};

export default MissionInformation;
