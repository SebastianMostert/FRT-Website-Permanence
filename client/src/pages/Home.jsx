import { useTranslation } from "react-i18next";
import ContactInfo from "../components/HomePage/ContactInfo";
import Footer from "../components/HomePage/Footer";
import Section from "../components/HomePage/Section";

const HomePage = () => {
  const { t } = useTranslation();
  const styles = {
    homepage: {
      textAlign: 'center',
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f4',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '2.5em',
      color: '#333',
      marginBottom: '20px',
    }
  };

  return (
    <div style={styles.homepage}>
      <h1 style={styles.title}>Lënster Lycée First Responder Team</h1>

      <Section
        title={t('home.title.mission')}
        content={t('home.description.mission')}
      />

      <Section
        title={t('home.title.contact')}
        content={<ContactInfo />}
      />

      <Footer />
    </div>
  );
};

export default HomePage;
