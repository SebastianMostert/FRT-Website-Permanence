import React from 'react';

const HomePage = () => {
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
    },
    section: {
      margin: '30px 0',
      fontSize: '1.2em',
      lineHeight: '1.6',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    strong: {
      fontWeight: 'bold',
    },
    footer: {
      marginTop: '30px',
      color: '#888',
      fontSize: '0.9em',
    },
  };

  return (
    <div style={styles.homepage}>
      <h1 style={styles.title}>Lenster Lycee First Responder Team</h1>

      <section style={styles.section}>
        <h2>Our Mission</h2>
        <p>
          Ensuring the safety and well-being of the school community at Lenster Lycee International School. We are dedicated to responding promptly and effectively to emergencies, providing assistance, and fostering a secure environment for all.
        </p>
      </section>

      <section style={styles.section}>
        <h2>Contact Us</h2>
        <p>
          For emergencies, dial <strong style={styles.strong}>112</strong>. <br />
          For non-emergency inquiries, you can email us at <a href="mailto:lux.frt.llis@gmail.com">lux.frt.llis@gmail.com</a>. <br />
          Follow us on Instagram: <a href="https://www.instagram.com/frt.llis/">@frt.llis</a>
        </p>
      </section>

      <footer style={styles.footer}>
        <p>&copy; 2024 Lenster Lycee First Responder Team</p>
      </footer>
    </div>
  );
};

export default HomePage;
