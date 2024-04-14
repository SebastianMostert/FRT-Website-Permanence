import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import TwoFactorAuthSetup from './TwoFactorAuthSetup'
import TwoFactorAuthRemove from './TwoFactorAuthRemove'
import { Card, ListGroup, Button, Container, Row, Col } from 'react-bootstrap'

import { useTranslation } from 'react-i18next'

const TwoFactorAuth = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(null)
    const [componentToShow, setComponentToShow] = useState(null)
    const { t } = useTranslation();

    const handleShowComponent = (component) => {
        setComponentToShow(component)
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/v1/user/fetch/2fa/${currentUser.IAM}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const data = await res.json()

                if (!res.ok) {
                    toast.error(t('2fa.error'))
                    return
                }
                setTwoFactorAuthEnabled(data);
            } catch (error) {
                toast.error(t('2fa.error'))
                console.log(error)
            }
        }

        fetchUser()
    }, [currentUser.IAM, t])

    const WhyTwoFactorAuth = () => {
        const Content = () => {
            return (
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md={8}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{t('2fa.title')}</Card.Title>
                                    <Card.Text>
                                        {t('2fa.description')}
                                    </Card.Text>
                                    <Card.Text>
                                        {t('2fa.reasons.title')}
                                    </Card.Text>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>{t('2fa.reasons.1')}</ListGroup.Item>
                                        <ListGroup.Item>{t('2fa.reasons.2')}</ListGroup.Item>
                                        <ListGroup.Item>{t('2fa.reasons.3')}</ListGroup.Item>
                                        <ListGroup.Item>{t('2fa.reasons.4')}</ListGroup.Item>
                                    </ListGroup>
                                    <Button variant="primary" onClick={() => handleShowComponent('setup')}>
                                        {t('2fa.button')}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )
        }

        return (
            <>
                {componentToShow === 'setup' ? (
                    <TwoFactorAuthSetup />
                ) : (
                    <Content />
                )}
            </>
        )
    }

    const YourAccountIsSafeW2FA = () => {
        const Content = () => {
            return (
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md={8}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{t('2fa.secured.title')}</Card.Title>
                                    <Card.Text>{t('2fa.secured.description')} </Card.Text>
                                    <Button variant="danger" onClick={() => handleShowComponent('remove')}>
                                        {t('2fa.secured.button')}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )
        }

        return (
            <>
                {componentToShow === 'remove' ? (
                    <TwoFactorAuthRemove />
                ) : (
                    <Content />
                )}
            </>
        )
    }

    if (twoFactorAuthEnabled) return <YourAccountIsSafeW2FA />
    else return <WhyTwoFactorAuth />
}

export default TwoFactorAuth