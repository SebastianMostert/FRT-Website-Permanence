import { useTranslation } from "react-i18next";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import StatCard from '../components/StatCard'; // Ensure the path is correct

const HomePage = () => {
  const [members, setMembers] = useState();
  const [cases, setCases] = useState();

  const { i18n, t } = useTranslation();

  useEffect(() => {
    // Load the saved language from session storage
    const savedLanguage = sessionStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    // Fetch the number of user
    const getUsers = async () => {
      const response = await fetch('/api/v1/stats/count/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roles: ['member'] }),
      });
      const data = await response.json();

      setMembers(data.count);
    };

    const getCases = async () => {
      const response = await fetch('/api/v1/stats/count/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      setCases(data.count);
    };

    getCases();
    getUsers();
  }, []);

  // TODO: Fetch statistics

  const contactDetails = [
    { label: `${t('home.contact.label.general_emergency')}`, value: <strong>112</strong> },
    { label: `${t('home.contact.label.school_emergency')}`, value: <strong>378</strong> },
    { label: `${t('home.contact.label.email')}`, value: 'lux.frt.llis@gmail.com', link: 'mailto:lux.frt.llis@gmail.com' },
    { label: `${t('home.contact.label.instagram')}`, value: '@frt.llis', link: 'https://www.instagram.com/frt.llis/' },
  ];

  // Hardcoded statistics
  const stats = [
    { title: t('home.stats.title.cases'), description: t('home.stats.description.cases'), value: cases },
    { title: t('home.stats.title.members'), description: t('home.stats.description.members'), value: members },
  ];

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card className="p-4 shadow-lg rounded-lg">
            <Card.Body>
              <h1 className="text-center mb-4">Lënster Lycée First Responder Team</h1>

              <Card.Text className="text-center"></Card.Text>

              <hr />

              <div className="mt-4">
                <h2>{t('home.title.mission')}</h2>
                <p>{t('home.description.mission')}</p>
              </div>

              <div className="mt-4">
                <h2>{t('home.title.contact')}</h2>
                <div className="space-y-2">
                  {contactDetails.map(({ label, value, link }) => (
                    <div key={label}>
                      <span className="font-weight-bold">{label}:</span>{" "}
                      {link ? (
                        <a href={link} className="text-primary">
                          {value}
                        </a>
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col xs={12}>
          <Card className="p-4 shadow-lg rounded-lg">
            <Card.Body>
              <div className="mt-4">
                <h2>{t('home.title.stats')}</h2>
                <Row className="justify-content-center">
                  {stats.map(({ title, description, value }) => (
                    <StatCard
                      key={title}
                      title={title}
                      description={description}
                      value={value}
                    />
                  ))}
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
