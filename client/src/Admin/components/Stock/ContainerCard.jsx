/* eslint-disable react/prop-types */
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { deleteContainer } from '../../pages/functions';

const ContainerCard = ({ container, setShowItems, showItems, setContainer, setRefreshTrigger }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const contextMenuRef = useRef(null);
    const { name, image } = container;

    const handleRightClick = (e) => {
        e.preventDefault();
        setShowContextMenu(true);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
        setShowItems(!showItems);
        setContainer(container);
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
    };

    const handleContextMenuAction1 = () => {
        deleteContainer(container._id);
        setRefreshTrigger(true);
        handleCloseContextMenu();
    };

    const handleContextMenuAction2 = () => {
        toast.error('[WIP] Edit clicked');
        handleCloseContextMenu();
    };

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

    return (
        <>
            <Card
                onContextMenu={handleRightClick}
                style={{ width: '18rem', cursor: 'pointer' }}
                onClick={handleClick}
            >
                <Card.Img variant="top" src={image} style={{ maxHeight: '200px', objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Title style={{ fontSize: '1rem' }}>{name}</Card.Title>
                </Card.Body>
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
                            <Dropdown.Item onClick={handleContextMenuAction2}><FontAwesomeIcon icon={faPenToSquare} />{' '}Edit</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}
        </>
    );
}

export default ContainerCard;