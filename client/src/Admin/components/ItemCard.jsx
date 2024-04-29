/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Card, ListGroup, InputGroup, Form, Button, Modal } from 'react-bootstrap';

const ItemCard = ({ placeholder, items }) => {
    const { image, name, minAmount, id } = placeholder;

    const [showItems, setShowItems] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemAmount, setNewItemAmount] = useState('');
    const [newItemExpirationDate, setNewItemExpirationDate] = useState('');

    // Get the corresponding items
    const correspondingItems = items.filter(item => item.placeholderID === id);

    // Calculate the total amount
    const totalAmount = correspondingItems.reduce((sum, item) => sum + item.amount, 0);

    // Determine card color based on total amount
    let cardColor = '';
    if (totalAmount === 0) {
        cardColor = 'danger'; // Red
    } else if (totalAmount < minAmount) {
        cardColor = 'warning'; // Yellow
    }

    // Check if any of the corresponding items are expiring soon
    const expiringSoon = correspondingItems.some(item => new Date(item.expirationDate) < new Date(Date.now() + (24 * 60 * 60 * 1000 * 7)));

    // Check if any of the corresponding items are expired
    const expired = correspondingItems.some(item => new Date(item.expirationDate) < new Date());

    // If there are expiring soon items, set the card color to yellow
    if (expiringSoon) {
        cardColor = 'warning';
    }

    // If there are expired items, set the card color to red
    if (expired) {
        cardColor = 'danger';
    }

    const handleAddItem = () => {
        // Validate inputs before adding the item
        if (!newItemAmount || !newItemExpirationDate) {
            alert('Please enter amount and expiration date.');
            return;
        }

        // Add logic to handle adding a new item to the placeholder
        // Example:
        // const newItem = {
        //     placeholderID: id,
        //     amount: parseInt(newItemAmount),
        //     expirationDate: newItemExpirationDate
        // };
        // Call a function to add the new item to the placeholder
        // Clear the input fields after adding the new item
        setNewItemAmount('');
        setNewItemExpirationDate('');
    };

    return (
        <>
            <div className='select-none text-black mb-2'>
                <Card
                    bg={cardColor}
                    style={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => {
                        if (correspondingItems.length == 0) setShowAddModal(true)
                        else setShowItems(!showItems)
                    }}
                >
                    <div className="d-flex">
                        <Card.Img variant="left" src={image} style={{ width: 'auto', height: '100px', objectFit: 'cover' }} />
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title>{name}</Card.Title>
                                    <Card.Text>{id}</Card.Text>
                                </div>
                                <div>
                                    <Card.Text>{totalAmount}/{minAmount}</Card.Text>
                                </div>
                            </div>
                        </Card.Body>
                    </div>
                </Card>
                {showItems && correspondingItems.length > 0 && (
                    <SubCard placeholder={placeholder} items={correspondingItems} showModal={setShowAddModal} />
                )}
            </div>
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount"
                            value={newItemAmount}
                            onChange={(e) => setNewItemAmount(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Expiration Date</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Enter expiration date"
                            value={newItemExpirationDate}
                            onChange={(e) => setNewItemExpirationDate(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddItem}>Add Item</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};


const SubCard = ({ placeholder, items, showModal }) => {
    const [itemAmounts, setItemAmounts] = useState(items.map(item => item.amount));

    const handleIncrease = (index) => {
        const newAmounts = [...itemAmounts];
        newAmounts[index]++;
        setItemAmounts(newAmounts);
    };

    const handleDecrease = (index) => {
        const newAmounts = [...itemAmounts];
        newAmounts[index] = Math.max(0, newAmounts[index] - 1);
        setItemAmounts(newAmounts);
    };

    return (
        <Card className="ml-2">
            <Card.Header>{placeholder.name}</Card.Header>
            <ListGroup variant="flush">
                {items.map((item, index) => {
                    let color = 'rgba(0, 0, 0, 0)';

                    const expirationDate = item.expirationDate;

                    // If the item is about to expire set the color to yellow
                    // About 7 days from now
                    const bufferTime = 24 * 60 * 60 * 1000 * 7;
                    if (new Date(expirationDate) < new Date(Date.now() + (bufferTime))) {
                        color = 'rgba(255, 255, 0, 0.75)';
                    }

                    // If the item is expired set the color to red
                    if (new Date(expirationDate) < new Date(Date.now())) {
                        color = 'rgba(255, 0, 0, 0.75)';
                    }

                    return (
                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center" style={{ backgroundColor: color }}>
                            <div className="d-flex align-items-center">
                                <InputGroup className="mr-2">
                                    <InputGroup.Text onClick={() => handleDecrease(index)}>-</InputGroup.Text>
                                    <InputGroup.Text>{itemAmounts[index]}</InputGroup.Text>
                                    <InputGroup.Text onClick={() => handleIncrease(index)}>+</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div>{expirationDate}</div>
                        </ListGroup.Item>
                    )
                })}

                {/* Add Item button */}
                <ListGroup.Item className="d-flex justify-content-center align-items-center">
                    <InputGroup.Text onClick={() => showModal(true)}>Add Item</InputGroup.Text>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};


export default ItemCard;
