/* eslint-disable react/prop-types */
const Section = ({ title, content }) => {
    const section = {
        margin: '30px 0',
        fontSize: '1.2em',
        lineHeight: '1.6',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    }
    
    return (
        <section style={section}>
            <h2>{title}</h2>
            <p>{content}</p>
        </section>
    );
};

export default Section;
