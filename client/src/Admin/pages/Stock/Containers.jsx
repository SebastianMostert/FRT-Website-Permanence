/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ContainerCard from '../../components/Stock/ContainerCard';
import Searchbar from '../../components/Stock/Searchbar';
import Items from './Items';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { createContainer, getContainers, imageURL } from '../functions';

const filterContainers = (containers, searchTerm, searchType) => {
    if (searchType === 'name') {
        return containers.filter(container =>
            container.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
    } else if (searchType === 'id') {
        return containers.filter(container =>
            container.id.toString().toLowerCase().startsWith(searchTerm.toLowerCase())
        );
    }
};

const Containers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showItems, setShowItems] = useState(false);
    const [container, setContainer] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false); // State to control the visibility of the create container modal
    const [newContainerName, setNewContainerName] = useState(''); // State to store the new container's name
    const [newContainerImage, setNewContainerImage] = useState(''); // State to store the new container's image as base64

    //#region Containers & Refreshing
    const [containers, setContainers] = useState([])
    const [refreshTrigger, setRefreshTrigger] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const containers = await getContainers();
            setContainers(containers)
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (!refreshTrigger) return;
        async function fetchData() {

            // Check what needs refreshing
            if (refreshTrigger) {
                const containers = await getContainers();
                setContainers(containers)
            }
        }

        fetchData();
        setRefreshTrigger(false);
    }, [refreshTrigger]);
    //#endregion

    const filteredContainers = filterContainers(containers, searchTerm, 'name');

    const handleCreateContainer = async () => {
        // Convert the selected image to base64
        const reader = new FileReader();
        reader.onload = async () => {
            // Create a new container with the provided name and image
            await createContainer(newContainerName, reader.result)
            setRefreshTrigger(true);
        };
        reader.readAsDataURL(newContainerImage);

        setNewContainerName(''); // Reset the new container name input field
        setNewContainerImage(''); // Reset the new container image input field
        setShowCreateModal(false); // Close the create container modal
    };

    return (
        <Container>
            {showItems ? (
                <Items containerID={container._id} onBackClick={() => setShowItems(false)} />
            ) : (
                <>
                    <Row className="mb-3">
                        <Col lg={12}>
                            <Searchbar
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                searchType={'name'}
                                searchWhat={'containers'}
                            />
                        </Col>
                    </Row>
                    <Row>
                        {filteredContainers.map((container, index) => (
                            <Col key={index} sm={12} md={6} lg={4} xl={3}>
                                <ContainerCard
                                    container={container}
                                    setShowItems={setShowItems}
                                    showItems={showItems}
                                    setContainer={setContainer}
                                    setRefreshTrigger={setRefreshTrigger}
                                />
                            </Col>
                        ))}
                        <Col sm={12} md={6} lg={4} xl={3}>
                            <Card style={{ width: '18rem', cursor: 'pointer' }} onClick={() => setShowCreateModal(true)}>
                                <Card.Img variant="top" src={imageURL} style={{ maxHeight: '200px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <Card.Title style={{ fontSize: '1rem' }}>Add Container</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* Create Container Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Container</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="newContainerName" className="form-label">Container Name</label>
                        <input type="text" className="form-control" id="newContainerName" value={newContainerName} onChange={(e) => setNewContainerName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newContainerImage" className="form-label">Container Image</label>
                        <input type="file" className="form-control" id="newContainerImage" onChange={(e) => setNewContainerImage(e.target.files[0])} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleCreateContainer}>Create</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Containers;
