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
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// PROTECTED ROUTES
router.post('/containers/fetch', verifyToken, fetchContainers); // Fetch all containers
router.post('/containers/create', verifyToken, createContainer); // Create a new container
router.delete('/containers/delete/:id', verifyToken, deleteContainer); // Delete a container

router.post('/placeholders/create/:id', verifyToken, createPlaceholder); // Create a new placeholder
router.delete('/placeholders/delete/:containerID/:placeholderID', verifyToken, deletePlaceholder); // Delete a placeholder

router.post('/items/create/:id', verifyToken, createItem); // Create a new item
router.post('/items/update/:id', verifyToken, increaseItemAmount); // Update a container
router.delete('/items/delete/:containerID/:placeholderID/:itemID', verifyToken, deleteItem); // Delete a item
export default router;
