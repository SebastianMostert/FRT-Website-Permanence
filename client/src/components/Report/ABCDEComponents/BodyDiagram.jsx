/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Image, Container, Row, Col, Button, Form } from 'react-bootstrap';

const BodyDiagram = ({ value, onChange, isEditable }) => {
    const [letters, setLetters] = useState(value?.letters || []);
    const [clickedPosition, setClickedPosition] = useState({ x: 0, y: 0 });
    const [selectedOption, setSelectedOption] = useState('');
    const disabled = !isEditable;

    useEffect(() => {
        setLetters(value?.letters || []);
    }, [value]);

    const handleClick = (event) => {
        const clickedX = (event.nativeEvent.offsetX / event.target.width) * 100;
        const clickedY = (event.nativeEvent.offsetY / event.target.height) * 100;

        setClickedPosition({ x: clickedX, y: clickedY });
    };

    const handleAddLetter = () => {
        if (selectedOption && selectedOption.trim() !== '') {
            const newLetter = {
                id: Date.now(),
                x: clickedPosition.x,
                y: clickedPosition.y,
                letter: selectedOption.trim().charAt(0).toUpperCase(),
            };

            setLetters((prevLetters) => [...prevLetters, newLetter]);
            setSelectedOption('');

            if (onChange) {
                onChange('exposureEnvironment', 'bodyDiagramLetters', [...letters, newLetter]);
            }
        }
    };

    const handleDeleteLetter = (id) => {
        const updatedLetters = letters.filter((item) => item.id !== id);
        setLetters(updatedLetters);

        if (onChange) {
            onChange('exposureEnvironment', 'bodyDiagramLetters', updatedLetters);
        }
    };

    const options = [
        { value: 'T', label: 'Trauma' },
        { value: 'F', label: 'Fracture (suspected)' },
        { value: 'I', label: 'Internal pain' },
        { value: 'B', label: 'Bleeding' },
        { value: 'V', label: 'Burn/Corrosion' },
    ];

    return (
        <Container>
            <Row>
                <Col>
                    <div style={{ position: 'relative' }}>
                        <Image
                            src="https://i.imgur.com/Y6opjHy.png"
                            alt="Clickable Image"
                            onClick={handleClick}
                            style={{ cursor: 'crosshair' }}
                            fluid
                        />
                        {(letters || []).map((item) => (
                            <Button
                                disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                key={item.id}
                                variant="danger"
                                style={{
                                    position: 'absolute',
                                    left: `${item.x}%`,
                                    top: `${item.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    borderRadius: '50%',
                                    width: '20px', // Adjust circle width
                                    height: '20px', // Adjust circle height
                                    padding: 0,
                                    textAlign: 'center',
                                    lineHeight: '20px',
                                    fontSize: '12px', // Adjust font size
                                }}
                                onClick={() => handleDeleteLetter(item.id)}
                            >
                                {item.letter}
                            </Button>
                        ))}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <Form.Group controlId="formSelect">
                            <Form.Label>Select an option:</Form.Label>
                            <Form.Control
                                disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                as="select"
                                value={selectedOption}
                                onChange={(e) => {
                                    setSelectedOption(e.target.value);
                                }}
                            >
                                <option value="">Select</option>
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }} variant="primary" onClick={handleAddLetter}>
                            Add Letter
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label>Letters:</Form.Label>
                    <ul>
                        {(letters || []).map((item) => (
                            <li key={item.id}>
                                {options.find((opt) => opt.value === item.letter)?.label}
                                {' '} at ({Math.floor(item.x)}, {Math.floor(item.y)})
                                <Button
                                    disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                                    variant="danger"
                                    size="sm"
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => handleDeleteLetter(item.id)}
                                >
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                </Col>
            </Row>
        </Container>
    );
};

export default BodyDiagram;
