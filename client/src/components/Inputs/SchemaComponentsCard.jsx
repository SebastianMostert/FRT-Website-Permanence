/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Card, InputGroup, Form } from 'react-bootstrap'

const SchemaComponentsCard = ({ disabled, body, title, bg, value, onChange, field }) => {
    const [showBody, setShowBody] = useState(false);

    useEffect(() => {
        if (value.problem) {
            setShowBody(true);
        }
    }, [value]);

    const handleCheckboxChange = (event) => {
        if (disabled) return;
        const isChecked = event.target.checked;
        setShowBody(isChecked);

        onChange(field, 'problem', isChecked);
    };

    const cardClick = () => {
        if (disabled) return;
        const isChecked = !showBody;
        setShowBody(isChecked);

        onChange(field, 'problem', isChecked);
    }

    return (
        <Card bg={bg} className='mb-3'>
            <Card.Header as="h5" onClick={cardClick} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
                <InputGroup className='justify-content-between'>
                    <Card.Title>
                        {title}
                    </Card.Title>
                    <Form.Check
                        disabled={disabled}
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        type='checkbox'
                        checked={showBody}
                        onChange={(e) => handleCheckboxChange(e)}
                    />
                </InputGroup>
            </Card.Header>

            {showBody && (
                <Card.Body>
                    {body}
                </Card.Body>
            )}

        </Card>
    )
}

export default SchemaComponentsCard