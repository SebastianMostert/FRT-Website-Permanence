/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { Card, ListGroup, InputGroup, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createItem, deleteItem, deletePlaceholder, getPlaceholderById, increaseItemAmount } from '../../pages/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const ItemCard = ({ placeholderID, containerID }) => {
    const [showItems, setShowItems] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemAmount, setNewItemAmount] = useState('');
    const [newItemExpirationDate, setNewItemExpirationDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [placeholder, setPlaceholder] = useState({});
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [itemAmounts, setItemAmounts] = useState();
    const contextMenuRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const placeholder = await getPlaceholderById(containerID, placeholderID);
            setItemAmounts(await placeholder.items.map(item => item.amount));
            setPlaceholder(placeholder);
            setLoading(false);
        };
        fetchData();
    }, [containerID, placeholderID]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setShowContextMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!refreshTrigger) return;
        async function fetchData() {
            const placeholder = await getPlaceholderById(containerID, placeholderID);
            setLoading(false);
            setItemAmounts(await placeholder.items.map(item => item.amount));
            setPlaceholder(placeholder);
            setRefreshTrigger(false);
        }
        fetchData();
    }, [containerID, placeholderID, refreshTrigger]);

    if (loading) return <div>Loading...</div>

    const { image, name, minAmount, barcodeID } = placeholder;

    // Calculate the total amount
    const totalAmount = placeholder.items.reduce((sum, item) => sum + item.amount, 0);

    // Determine card color based on total amount
    let cardColor = '';
    if (totalAmount === 0) {
        cardColor = 'danger'; // Red
    } else if (totalAmount < minAmount) {
        cardColor = 'warning'; // Yellow
    }

    // Check if any of the corresponding items are expiring soon
    const expiringSoon = placeholder.items.some(item => new Date(item.expirationDate) < new Date(Date.now() + (24 * 60 * 60 * 1000 * 7)));

    // Check if any of the corresponding items are expired
    const expired = placeholder.items.some(item => new Date(item.expirationDate) < new Date());

    // If there are expiring soon items, set the card color to yellow
    if (expiringSoon) {
        cardColor = 'warning';
    }

    // If there are expired items, set the card color to red
    if (expired) {
        cardColor = 'danger';
    }

    const handleAddItem = async () => {
        // Validate inputs before adding the item
        if (!newItemAmount || !newItemExpirationDate) {
            toast.error('Please enter amount and expiration date.');
            return;
        }

        await createItem(containerID, parseInt(newItemAmount), newItemExpirationDate, placeholder._id)

        setRefreshTrigger(true)

        setNewItemAmount('');
        setNewItemExpirationDate('');
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        setShowContextMenu(true);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
    };

    const handleContextMenuAction1 = async () => {
        await deletePlaceholder(containerID, placeholder._id);
        setRefreshTrigger(true);
        handleCloseContextMenu();
    };

    const handleIncrease = async (index, id) => {
        const newAmounts = [...itemAmounts];
        const newValue = newAmounts[index] + 1;
        newAmounts[index] = newValue;

        setItemAmounts(newAmounts);

        // Get the item id
        await increaseItemAmount(id, newValue, containerID, placeholder._id)
        setRefreshTrigger(true)
    };

    const handleDecrease = async (index, id) => {
        const newAmounts = [...itemAmounts];
        const oldValue = itemAmounts[index];
        const newValue = Math.max(0, newAmounts[index] - 1);

        newAmounts[index] = newValue;
        setItemAmounts(newAmounts);

        // Get the item id
        if (oldValue != newValue) {
            if (newValue == 0) await deleteItem(containerID, placeholder._id, id)
            else await increaseItemAmount(id, newValue, containerID, placeholder._id)
            setRefreshTrigger(true)
        }
    };

    return (
        <>
            <div className='select-none text-black mb-2'>
                <Card
                    onContextMenu={handleRightClick}
                    bg={cardColor}
                    style={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => {
                        if (placeholder.items.length == 0) setShowAddModal(true)
                        else setShowItems(!showItems)
                    }}
                >
                    <div className="d-flex">
                        <Card.Img variant="left" src={image} style={{ width: 'auto', height: '100px', objectFit: 'cover' }} />
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title>{name}</Card.Title>
                                    <Card.Text>{barcodeID}</Card.Text>
                                </div>
                                <div>
                                    <Card.Text>{totalAmount}/{minAmount}</Card.Text>
                                </div>
                            </div>
                        </Card.Body>
                    </div>
                </Card>
                {showContextMenu && (
                    <div ref={contextMenuRef}>
                        <Dropdown
                            style={{ position: 'fixed', zIndex: 1000, top: contextMenuPosition.y, left: contextMenuPosition.x }}
                            show={showContextMenu}
                            onClose={handleCloseContextMenu}
                        >
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleContextMenuAction1}><FontAwesomeIcon icon={faTrashCan} />{' '}Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}
                {showItems && placeholder.items.length > 0 && (
                    <SubCard containerID={containerID} placeholder={placeholder} itemAmounts={itemAmounts} showModal={setShowAddModal} handleIncrease={handleIncrease} handleDecrease={handleDecrease} />
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

const SubCard = ({ placeholder, showModal, handleIncrease, handleDecrease, itemAmounts }) => {
    const items = placeholder.items;

    return (
        <Card className="ml-2">
            <Card.Header>{placeholder.name}</Card.Header>
            <ListGroup variant="flush">
                {items.map((item, index) => {
                    let color = 'rgba(0, 0, 0, 0)';

                    const expirationDate = new Date(item.expirationDate).toISOString().slice(0, 10);

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
                                    <InputGroup.Text onClick={() => handleDecrease(index, item._id)}>-</InputGroup.Text>
                                    <InputGroup.Text>{itemAmounts[index]}</InputGroup.Text>
                                    <InputGroup.Text onClick={() => handleIncrease(index, item._id)}>+</InputGroup.Text>
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
