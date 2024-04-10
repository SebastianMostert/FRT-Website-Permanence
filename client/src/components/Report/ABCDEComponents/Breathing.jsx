/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Form, Row, Col, Card, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import IncreaseDecreaseButton from '../../Inputs/IncreaseDecreaseButton';

const Breathing = ({ value = {}, onChange, isEditable }) => {
    const { t } = useTranslation();
    const [showSauerstoffgabe, setShowSauerstoffgabe] = useState(false);

    const disabled = !isEditable;

    const handleRadioChange = (field, value) => {
        onChange('breathing', field, value);
    };

    const handleMeasureChange = (measure) => {
        if (measure === 'sauerstoffgabe') {
            setShowSauerstoffgabe(!showSauerstoffgabe);
        }
        onChange('breathing', measure, !value[measure]);
    };

    return (
        <Form.Group className="mb-3">
            <Card body>
                <Container>
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Form.Label>{t('abcde.category.diagnostic')}</Form.Label>
                                    <hr />
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t('breathing.diagnostic.respiration_rate.label')}</Form.Label>
                                        <Form.Control
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            as="select"
                                            value={value.breathingSpeed || ''}
                                            onChange={(e) => onChange('breathing', 'breathingSpeed', e.target.value)}
                                        >
                                            <option value="">{t('breathing.diagnostic.respiration_rate.select')}</option>
                                            <option value="Aupnoe (Keine)">{t('breathing.diagnostic.respiration_rate.apnea')}</option>
                                            <option value="Bradypnoe (langsam)">{t('breathing.diagnostic.respiration_rate.bradypnea')}</option>
                                            <option value="Eupnoe (normal)">{t('breathing.diagnostic.respiration_rate.eupnea')}</option>
                                            <option value="Tachypnoe (schnell)">{t('breathing.diagnostic.respiration_rate.tachypnea')}</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('breathing.diagnostic.auscultation_equal')}
                                            checked={value.auskultationSeitengleich || false}
                                            onChange={() => handleMeasureChange('auskultationSeitengleich')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t('breathing.diagnostic.thorax.label')}</Form.Label>
                                        <div>
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('breathing.diagnostic.thorax.stable')}
                                                name="thorax"
                                                checked={value.thorax === 'Stabil'}
                                                onChange={() => handleRadioChange('thorax', 'Stabil')}
                                            />
                                            <Form.Check
                                                disabled={disabled}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                inline
                                                type="radio"
                                                label={t('breathing.diagnostic.thorax.unstable')}
                                                name="thorax"
                                                checked={value.thorax === 'Instabil'}
                                                onChange={() => handleRadioChange('thorax', 'Instabil')}
                                            />
                                        </div>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Form.Label>{t('abcde.category.measures')}</Form.Label>
                                    <hr />
                                    <Form.Check
                                        disabled={disabled}
                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                        type="checkbox"
                                        label={t('breathing.measures.oxygen_administered.label')}
                                        checked={value.sauerstoffgabe || false}
                                        onChange={() => handleMeasureChange('sauerstoffgabe')}
                                    />
                                    <Form.Group className="mb-3">
                                        {value.sauerstoffgabe && (
                                            <>
                                                <Form.Label>{t('breathing.measures.oxygen_administered.amount')}</Form.Label>
                                                <div className="input-group">
                                                    <IncreaseDecreaseButton
                                                        amountToAdd={-1}
                                                        prevAmount={value.sauerstoffgabeLiters}
                                                        disabled={disabled}
                                                        onChange={(e) => onChange('breathing', 'sauerstoffgabeLiters', e)}
                                                    />
                                                    <Form.Control
                                                        disabled={true}
                                                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                                        type="number"
                                                        value={value.sauerstoffgabeLiters}
                                                        onChange={(e) => onChange('breathing', 'sauerstoffgabeLiters', e.target.value)}
                                                        required={value.sauerstoffgabe}
                                                        min={0}
                                                    />
                                                    <IncreaseDecreaseButton
                                                        amountToAdd={1}
                                                        prevAmount={value.sauerstoffgabeLiters}
                                                        disabled={disabled}
                                                        onChange={(e) => onChange('breathing', 'sauerstoffgabeLiters', e)}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('breathing.measures.nasal_cannula')}
                                            checked={value.brille || false}
                                            onChange={() => handleMeasureChange('brille')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('breathing.measures.oxygen_mask')}
                                            checked={value.maske || false}
                                            onChange={() => handleMeasureChange('maske')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('breathing.measures.ambu')}
                                            checked={value.beatmungsbeutel || false}
                                            onChange={() => handleMeasureChange('beatmungsbeutel')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('breathing.measures.assisted_breathing')}
                                            checked={value.assistierteBeatmung || false}
                                            onChange={() => handleMeasureChange('assistierteBeatmung')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('breathing.measures.hyperventilation_mask')}
                                            checked={value.hyperventilationsmaske || false}
                                            onChange={() => handleMeasureChange('hyperventilationsmaske')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            disabled={disabled}
                                            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                            type="checkbox"
                                            label={t('breathing.measures.upper_body_elevation')}
                                            checked={value.oberkörperhochlagerung || false}
                                            onChange={() => handleMeasureChange('oberkörperhochlagerung')}
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Card>
        </Form.Group >
    );
};

export default Breathing;
