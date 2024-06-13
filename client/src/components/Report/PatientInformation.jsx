/* eslint-disable react/prop-types */
import { Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidIAM } from '../../utils';

const PatientInformation = ({ patientInfo, handlePatientChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    const [ageInputEnabled, setAgeInputEnabled] = useState(!disabled);

    const { feedback: iamFeedback, showFeedback: iamShowFeedback, minLength: iamMinLength } = isValidIamInput(false, patientInfo.IAM, t);
    const { feedback: matriculeFeedback, showFeedback: matriculeShowFeedback, minLength: matriculeMinLength } = isValidMatriculeInput(patientInfo.matricule, t);

    const updateAge = (age) => {
        const fakeEvent = {
            target: {
                name: 'age',
                value: age
            }
        }

        patientInfo.age = age;
        handlePatientChange(fakeEvent);
    }

    const onChangeIAM = (event) => {
        handlePatientChange(event);
    };

    const onChangeMatricule = (event) => {
        const matricule = `${event.target.value}`;

        if (!disabled) {
            if (matricule.length > 0) setAgeInputEnabled(false);
            else setAgeInputEnabled(true);
        }

        if (matricule.length >= 8) {
            const { date } = getMatriculeDate(matricule);

            const age = getAge(date);

            updateAge(age);
        }

        handlePatientChange(event);
    };

    return (
        <Form.Group>
            <h5>{t('patient_information.title')}</h5>
            <hr />
            <Row className="mb-3">
                <Col sm={6}>
                    <Form.Label>{t('patient_information.age.label')}</Form.Label>
                    <Form.Control
                        disabled={!ageInputEnabled}
                        style={{ cursor: !ageInputEnabled ? 'not-allowed' : 'pointer' }}
                        type="number"
                        placeholder={t('patient_information.age.placeholder')}
                        name="age"
                        value={patientInfo.age}
                        onChange={handlePatientChange}
                    />
                </Col>
                <Col sm={6}>
                    <Form.Label>{t('patient_information.gender.label')}</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        as="select"
                        name="gender"
                        value={patientInfo.gender}
                        onChange={handlePatientChange}
                    >
                        <option value="">{t('patient_information.gender.placeholder')}</option>
                        <option value="Male">{t('patient_information.gender.male')}</option>
                        <option value="Female">{t('patient_information.gender.female')}</option>
                        <option value="Other">{t('patient_information.gender.other')}</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={6}>
                    <Form.Label>{t('patient_information.first_name.label')}</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="text"
                        placeholder={t('patient_information.first_name.placeholder')}
                        name="firstName"
                        value={patientInfo.firstName}
                        onChange={handlePatientChange}
                    />
                </Col>
                <Col sm={6}>
                    <Form.Label>{t('patient_information.last_name.label')}</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="text"
                        placeholder={t('patient_information.last_name.placeholder')}
                        name="lastName"
                        value={patientInfo.lastName}
                        onChange={handlePatientChange}
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={12}>
                    <Form.Label>IAM</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="text"
                        placeholder={t('patient_information.iam.placeholder')}
                        name="IAM"
                        value={patientInfo.IAM}
                        onChange={(e) => onChangeIAM(e)}
                        minLength={iamMinLength}
                        maxLength={8}
                        isInvalid={iamShowFeedback}
                    />
                    <Form.Control.Feedback type="invalid">
                        {iamFeedback}
                    </Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={12}>
                    <Form.Label>{t('patient_information.matricule.label')}</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="text"
                        placeholder={t('patient_information.matricule.placeholder')}
                        name="matricule"
                        value={patientInfo.matricule}
                        onChange={(e) => onChangeMatricule(e)}
                        minLength={matriculeMinLength}
                        maxLength={13}
                        isInvalid={matriculeShowFeedback}
                        required={matriculeMinLength >= 13}
                    />
                    <Form.Control.Feedback type="invalid">
                        {matriculeFeedback}
                    </Form.Control.Feedback>
                </Col>
            </Row>
        </Form.Group>
    );
};

export default PatientInformation;

function isValidIamInput(required, IAM, t) {
    let showFeedback = false;
    let minLength = 0;
    let feedback = '';

    function setFeedback(_feedback) {
        feedback = _feedback;
        showFeedback = true;

        // Setting this to any number higher than 8 will ensure an error message is shown
        minLength = 9;
    }

    // If required, ensure that the IAM is valid
    if (required) {
        const { valid, message } = isValidIAM(IAM, t);
        if (!valid) {
            setFeedback(message);
        }
    } else if (IAM.length > 0) {
        // If not required but the IAM is not empty, ensure that the IAM is valid
        const { valid, message } = isValidIAM(IAM, t);
        if (!valid) {
            setFeedback(message);
        }
    }

    return { showFeedback, minLength, feedback };
}

function isValidMatriculeInput(matricule, t) {
    let showFeedback = false;
    let minLength = 14;
    let feedback = '';

    const matriculeLength = matricule.length;

    function setFeedback(_feedback) {
        feedback = _feedback;
        showFeedback = true;

        // Setting this to any number higher than 13 will ensure an error message is shown
        minLength = 14;
    }

    // Ensure that the matricule is 13 characters long
    if (matriculeLength > 0) {
        if (matriculeLength != 13) {
            setFeedback(t('input.matricule.error.length'));
        } else if (!/^[0-9]{8}[0-9X]{5}$/.test(matricule)) {
            setFeedback(t('input.matricule.error.format'));
        } else if (/^[0-9]{8}X{5}$/.test(matricule) || /^[0-9]{13}$/.test(matricule)) {
            // Is valid
        } else {
            setFeedback(t('input.matricule.error.format'));
        }
    }
    if (!showFeedback) {
        // Check if the matricule contains a valid date
        const { date } = getMatriculeDate(matricule);
        const validDate = date.toString() !== 'Invalid Date'
        // Check if the date is valid


        if (matriculeLength > 0) {
            if (!validDate) {
                setFeedback(t('input.matricule.error.date'));
            } else {
                minLength = 13;
            }
        } else {
            minLength = 0;
        }
    }

    return { showFeedback, minLength, feedback };
}

function getMatriculeDate(matricule) {
    // The first 4 numbers are the full year
    // The next 2 are the month
    // The next 2 are the day
    // The rest are other numbers

    const year = matricule.slice(0, 4);
    const month = matricule.slice(4, 6);
    const day = matricule.slice(6, 8);
    const extraNums = matricule.slice(8);

    const date = new Date(`${year}-${month}-${day}`);


    return { date, extraNums };
}

function getAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}