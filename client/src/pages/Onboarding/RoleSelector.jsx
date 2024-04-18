import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card } from 'react-bootstrap';

const roles = [
    {
        id: 1,
        title: 'Member',
        description: 'A member of the First responder team. Members are automatically verified using a list of their IAMs. They have access to post availabilities, create, and view reports.',
    },
    {
        id: 2,
        title: 'Public',
        description: 'A member of the Public. The public doesn\'t need to be verified. They have limited access to information.',
    },
    {
        id: 3,
        title: 'Loge',
        description: 'Someone from the school\'s loge. Loge personnel need to be verified by an admin. They have access to view the current situation, such as who is currently on call.',
    },
];

const RoleSelector = ({ darkMode, onChange, onNext }) => {
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleChange = (role) => {
        setSelectedRole(role.title);
        onChange('roles', [role.title.toLocaleLowerCase()]);
    };

    useEffect(() => {
        if (selectedRole) {
            const timer = setTimeout(() => {
                onNext();
            }, 500); // Adjust the delay as needed
            return () => clearTimeout(timer);
        }
    }, [selectedRole, onNext]);

    const cardBackgroundColor = darkMode ? '#343a40' : '#f8f9fa'; // Adjust background color based on darkMode
    const colorPrimary = darkMode ? '#0d6efd' : '#007bff'; // Blue color for selected role in dark mode, and default blue in light mode

    return (
        <div>
            <Container>
                <h1>Select what applies to you</h1>
                <Row className="mt-4">
                    {roles.map((role) => (
                        <Col key={role.id} md={4}>
                            <Card
                                className={`text-${darkMode ? 'white' : 'dark'} role-card`}
                                style={{
                                    backgroundColor: selectedRole === role.title ? colorPrimary : cardBackgroundColor, // Use cardBackgroundColor
                                    transition: 'background-color 0.3s ease',
                                    transform: selectedRole === role.title ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: selectedRole === role.title ? '0px 0px 15px rgba(0, 0, 0, 0.2)' : 'none'
                                }}
                                onClick={() => handleRoleChange(role)}
                            >
                                <Card.Body>
                                    <Card.Title>{role.title}</Card.Title>
                                    <Card.Text>{role.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default RoleSelector;

RoleSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    darkMode: PropTypes.bool.isRequired // Add darkMode prop type
};
