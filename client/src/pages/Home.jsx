import { useTranslation } from "react-i18next";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect } from "react";

const HomePage = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // Load the saved language from session storage
    const savedLanguage = sessionStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const languageChangeHandler = (event) => {
    const selectedLanguage = event.target.value;

    // Save the selected language to session storage
    sessionStorage.setItem('selectedLanguage', selectedLanguage);

    // Change the language
    i18n.changeLanguage(selectedLanguage);
  };

  const contactDetails = [
    { label: `${t('home.contact.label.112')}`, value: '112' },
    { label: `${t('home.contact.label.email')}`, value: 'lux.frt.llis@gmail.com', link: 'mailto:lux.frt.llis@gmail.com' },
    { label: `${t('home.contact.label.instagram')}`, value: '@frt.llis', link: 'https://www.instagram.com/frt.llis/' },
  ];

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col>
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
            <Card.Footer className="bg-transparent border-0 d-flex justify-content-between align-items-center">
              <small className="text-muted">
                &copy; {new Date().getFullYear()} Lënster Lycée International School First Responder Team
              </small>
              <div>
                <select
                  id="languageSelector"
                  onChange={languageChangeHandler}
                  value={i18n.language}
                >
                  <option value="en">{t("language.english")}</option>
                  <option value="fr">{t("language.french")}</option>
                  <option value="de">{t("language.german")}</option>
                  <option value="lu">{t("language.luxembourgish")}</option>
                </select>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
