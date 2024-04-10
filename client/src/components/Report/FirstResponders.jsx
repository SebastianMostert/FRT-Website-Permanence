/* eslint-disable react/prop-types */
import { Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const FirstResponders = ({ firstResponders, handleResponderChange, isEditable }) => {
    const { t } = useTranslation();
    const disabled = !isEditable;

    const onChange = (index, e) => {
        const { value } = e.target;
        const updatedResponders = [...firstResponders];
        updatedResponders[index].iam = value;

        handleResponderChange(updatedResponders);
    };

    return (
        <Form.Group>
            <h5>{t('first_responders.title')}</h5>
            <hr />
            {firstResponders.map((responder, index) => {
                // Show feedback only if the responder is not a stagiaire OR if the user partially filled the form

                const { feedback, showFeedback, minLength } = isValid(responder, t);

                return (
                    <Row key={index} className="mb-3">
                        <Col sm={8} className="mx-auto">
                            <Form.Label>{responder.position}</Form.Label>
                            <Form.Control
                                disabled={disabled}
                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                type="text"
                                placeholder={t('first_responders.iam.placeholder')}
                                value={responder.iam}
                                onChange={(e) => onChange(index, e)}
                                minLength={minLength}
                                maxLength={8}
                                isInvalid={showFeedback}
                                required={minLength >= 8}
                            />
                            <Form.Control.Feedback type="invalid">
                                {feedback}
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                )
            }
            )}
        </Form.Group>
    );
};

export default FirstResponders;

function isValid(responder, t) {
    const isStagiaire = responder.position === 'Stagiaire Bin.';
    let showFeedback = false;
    let minLength = 9;
    let feedback = '';
    function setFeedback(_feedback) {
        feedback = _feedback;
        showFeedback = true;

        // Setting this to any number higher than 8 will ensure an error message is shown
        minLength = 9;
    }

    // If the user is a stagiaire and the iam is not empty validate it:
    if (isStagiaire && responder.iam.length > 0) {
        const { valid, message } = isValidIAM(responder.iam, t);
        if (!valid) {
            setFeedback(message);
        }
    }

    // If the user is not a stagiaire validate the IAM
    if (!isStagiaire) {

        const { valid, message } = isValidIAM(responder.iam, t);
        if (!valid) {
            setFeedback(message);
        }
    }

    // If the showFeedback is false, proceed:
    if (!showFeedback) {
        // If the user is a stagiaire set minLength to 0
        if (isStagiaire) {
            minLength = 0;
        } else {
            minLength = 8;
        }
    }

    return { showFeedback, minLength, feedback };
}

export function isValidIAM(IAM, t) {
    // Check the length of the IAM it must be 8
    if (IAM.length != 8) {
        return { valid: false, message: t('input.iam.error.length') };
    }

    // Check that the first 5 characters are letters
    if (!/^[a-zA-Z]{5}/.test(IAM)) {
        return { valid: false, message: t('input.iam.error.letters') };
    }

    // Check that the last 3 characters are digits
    if (!/[0-9]{3}$/.test(IAM)) {
        return { valid: false, message: t('input.iam.error.digits') };
    }

    return { valid: true, message: '' };
}