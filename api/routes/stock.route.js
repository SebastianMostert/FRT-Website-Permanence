import express from 'express';
import {
    createContainer,
    createItem,
    createPlaceholder,
    fetchContainers,
    increaseItemAmount,
    deleteContainer,
    deleteItem,
    deletePlaceholder,
} from '../controllers/stock.controller.js';

const router = express.Router();

router.post('/containers/fetch', fetchContainers); // Fetch all containers
router.post('/containers/create', createContainer); // Create a new container
router.delete('/containers/delete/:id', deleteContainer); // Delete a container

router.post('/placeholders/create/:id', createPlaceholder); // Create a new placeholder
router.delete('/placeholders/delete/:containerID/:placeholderID', deletePlaceholder); // Delete a placeholder

router.post('/items/create/:id', createItem); // Create a new item
router.post('/items/update/:id', increaseItemAmount); // Update a container
router.delete('/items/delete/:containerID/:placeholderID/:itemID', deleteItem); // Delete a item
export default router;
