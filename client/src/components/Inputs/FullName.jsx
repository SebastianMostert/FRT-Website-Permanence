/* eslint-disable react/prop-types */
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const FullNameInput = ({ formData, handleChange, style = {}, className = '' }) => {
    const { t } = useTranslation();
    
    return (
        <div id='Names' style={style} className={className}>
            <Row>
                <Col>
                    <Form.Group controlId='firstName'>
                        <FloatingLabel
                            label={t('profile.first_name')}
                            className="mb-3"
                            controlId='firstName'
                        >
                            <Form.Control
                                type='text'
                                value={formData.firstName}
                                placeholder={t('profile.first_name')}
                                onChange={handleChange}

                            />
                        </FloatingLabel>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='lastName'>
                        <FloatingLabel
                            label={t('profile.last_name')}
                            className="mb-3"
                            controlId='lastName'
                        >
                            <Form.Control
                                type='text'
                                value={formData.lastName}
                                placeholder={t('profile.last.name')}
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    )
}

export default FullNameInput