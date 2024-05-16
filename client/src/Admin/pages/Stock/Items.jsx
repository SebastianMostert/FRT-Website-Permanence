/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button, Row, Col, Modal, Card } from 'react-bootstrap';
import Quagga from 'quagga'; // Import QuaggaJS library
import Searchbar from '../../components/Stock/Searchbar';
import ItemCard from '../../components/Stock/ItemCard';
import { createPlaceholder, getContainerById, imageURL } from '../functions';

const Items = ({ containerID, onBackClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [container, setContainer] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const container = await getContainerById(containerID);
            setLoading(false);
            setContainer(container);
        }
        fetchData();
    }, [containerID]);

    useEffect(() => {
        if (!refreshTrigger) return;
        async function fetchData() {
            const container = await getContainerById(containerID);
            setLoading(false);
            setContainer(container);
        }
        fetchData();
    }, [containerID, refreshTrigger]);

    const handleAddItem = async ({ name, minAmount, barCodeID, picture }) => {
        const containerId = containerID;
        await createPlaceholder(containerId, name, minAmount, barCodeID, picture)
        setRefreshTrigger(true);
    };

    return (
        <>
            <Row className="mb-3">
                <Col lg={1}>
                    <Button variant="light" onClick={onBackClick} block>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </Button>
                </Col>
                <Col lg={11}>
                    <Searchbar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        searchType={'name'}
                        searchWhat={'containers'}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    {!loading && container.placeholders.map((placeholder, index) => (
                        <div key={index}>
                            <ItemCard placeholderID={placeholder._id} placeholder={placeholder} containerID={containerID} />
                        </div>
                    ))}
                    <div className='select-none text-black mb-2' onClick={() => setShowModal(true)}>
                        <Card
                            style={{ width: '100%', cursor: 'pointer' }}
                        >
                            <div className="d-flex">
                                <Card.Img variant="left" src={imageURL} style={{ width: 'auto', height: '100px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <Card.Title>Create New Item</Card.Title>
                                        </div>
                                    </div>
                                </Card.Body>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
            {/* Modal component */}
            <AddItemModal show={showModal} onHide={() => setShowModal(false)} handleAddItem={handleAddItem} />
        </>
    );
};

export default Items;

// Modal component with barcode scanning functionality
const AddItemModal = ({ show, onHide, handleAddItem }) => {
    const videoRef = useRef(null);
    const [barcode, setBarcode] = useState('');
    const [name, setName] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [picture, setPicture] = useState(null);

    const handleManualAdd = () => {
        // Handle manual addition of item
        const reader = new FileReader();
        reader.onload = async () => {
            await handleAddItem({ barCodeID: barcode, name, minAmount, picture: reader.result })
            onHide(); // Close the modal
        };
        reader.readAsDataURL(picture); // Read the selected image file and convert it to base64
    };

    useEffect(() => {
        if (show) {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: videoRef.current,
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment"
                    },
                },
                decoder: {
                    readers: ["ean_reader"]
                }
            }, (err) => {
                if (err) {
                    console.error("Error initializing Quagga:", err);
                    return;
                }
                Quagga.start();
            });

            Quagga.onDetected((data) => {
                handleDetectedBarcode(data.codeResult.code);
                onHide(); // Close the modal after barcode is detected
            });

            return () => {
                Quagga.stop();
            };
        }
    }, [onHide, show]);

    const handleDetectedBarcode = (barcode) => {
        // Handle the detected barcode
        setBarcode(barcode); // Set the detected barcode in the state
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Scan Barcode or Enter Manually</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <video ref={videoRef} style={{ width: "100%", maxWidth: "500px", height: "auto" }} />
                </div>
                <div className="mb-3">
                    <label htmlFor="barcode" className="form-label">Barcode</label>
                    <input type="text" className="form-control" id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="minAmount" className="form-label">Minimum Amount</label>
                    <input type="number" className="form-control" id="minAmount" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="picture" className="form-label">Picture</label>
                    <input type="file" className="form-control" id="picture" onChange={(e) => setPicture(e.target.files[0])} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handleManualAdd}>Add Manually</Button>
            </Modal.Footer>
        </Modal>
    );
};
