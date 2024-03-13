import LanguageSelector from "../Inputs/LanguageSelector";

const Footer = () => {
    const footerStyle = {
        marginTop: '30px',
        color: '#888',
        fontSize: '0.9em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    return (
        <footer style={footerStyle}>
            <p>&copy; {new Date().getFullYear()} Lënster Lycée International School First Responder Team</p>
            <LanguageSelector />
        </footer>
    );
};

export default Footer;
