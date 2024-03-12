const Footer = () => {
    const footer = {
        marginTop: '30px',
        color: '#888',
        fontSize: '0.9em',
    }

    return (
        <footer style={footer}>
            <p>&copy; {new Date().getFullYear()} Lënster Lycée International School First Responder Team</p>
        </footer>
    );
};

export default Footer;