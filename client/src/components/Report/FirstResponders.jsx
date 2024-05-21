/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// TODO: Add auto complete for IAM based on team

const FirstResponders = ({ firstResponders, isEditable, setFirstResponders }) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const disabled = !isEditable;

    const handleSingleResponderChange = (field, subField, value) => {
        setFirstResponders({
            ...firstResponders,
            [field]: {
                ...firstResponders[field],
                [subField]: value,
            },
        });
    };

    const onChangeSelectedTeam = (e) => {
        const value = e.target.value

        setSelectedTeam(value)
        setFirstResponders({
            ...firstResponders,
            "teamID": value,
        });
    };

    // First we need to fetch the teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch('/api/v1/team/fetch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                setTeams(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTeams();
    }, []);

    if (loading) return <>...</>;

    const { feedback: chefAgresFeedback, minLength: chefAgresMinLength } = isValid('chefAgres', firstResponders?.chefAgres?.IAM || '', t);
    const { feedback: equipierFeedback, minLength: equipierMinLength } = isValid('equipier', firstResponders?.equipier?.IAM || '', t);
    const { feedback: stagiaireFeedback, minLength: stagiaireMinLength } = isValid('stagiaire', firstResponders?.stagiaire?.IAM || '', t);

    return (
        <Form.Group>
            <h5>{t('first_responders.title')}</h5>
            <hr />
            <Form.Label>{t('first_responders.team.label')}</Form.Label>
            <Form.Select
                disabled={disabled}
                value={firstResponders.teamID}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                onChange={onChangeSelectedTeam}
                required
            >
                <option value="">{t('first_responders.team.placeholder')}</option>
                {teams.map((team) => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                ))}
            </Form.Select>
            <hr />
            {/* Loop over the responders */}
            <Row className="mb-3">
                <Col sm={8} className="mx-auto">
                    <Form.Label>{t('first_responders.chef_agres.label')}</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="text"
                        placeholder={t('first_responders.iam.placeholder')}
                        value={firstResponders.chefAgres.IAM}
                        onChange={(e) => handleSingleResponderChange('chefAgres', 'IAM', e.target.value)}
                        minLength={chefAgresMinLength}
                        maxLength={8}
                        required
                    />
                    <Form.Control.Feedback type="invalid">{chefAgresFeedback}</Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={8} className="mx-auto">
                    <Form.Label>{t('first_responders.equipier.label')}</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="text"
                        placeholder={t('first_responders.iam.placeholder')}
                        value={firstResponders.equipier.IAM}
                        onChange={(e) => handleSingleResponderChange('equipier', 'IAM', e.target.value)}
                        minLength={equipierMinLength}
                        maxLength={8}
                        required
                    />
                    <Form.Control.Feedback type="invalid">{equipierFeedback}</Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={8} className="mx-auto">
                    <Form.Label>{t('first_responders.stagiaire.label')}</Form.Label>
                    <Form.Control
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type="text"
                        placeholder={t('first_responders.iam.placeholder')}
                        value={firstResponders.stagiaire.IAM}
                        onChange={(e) => handleSingleResponderChange('stagiaire', 'IAM', e.target.value)}
                        minLength={stagiaireMinLength}
                        maxLength={8}
                    />
                    <Form.Control.Feedback type="invalid">{stagiaireFeedback}</Form.Control.Feedback>
                </Col>
            </Row>
        </Form.Group>
    );
};

export default FirstResponders;

function isValid(position, IAM, t) {
    const isStagiaire = position === 'Stagiaire Bin.';
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
    if (isStagiaire && IAM.length > 0) {
        const { valid, message } = isValidIAM(IAM, t);
        if (!valid) {
            setFeedback(message);
        }
    }

    // If the user is not a stagiaire validate the IAM
    if (!isStagiaire) {
        const { valid, message } = isValidIAM(IAM, t);
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

// eslint-disable-next-line react-refresh/only-export-components
export function isValidIAM(IAM = '', t) {
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