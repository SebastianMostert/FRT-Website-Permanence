import Container from '../models/stock.model.js';
import { errorHandler } from '../utils/error.js';

// Test
export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

// Fetch containers
export const fetchContainers = async (req, res) => {
    try {
        const containers = await Container.find();
        res.json(containers);
    } catch (error) {
        errorHandler(error, res);
    }
};

// Create a new container
export const createContainer = async (req, res) => {
    const { name, image } = req.body;
    try {
        const container = new Container({ name, image });
        await container.save();
        res.json({ message: 'Container created successfully' });
    } catch (error) {
        errorHandler(error, res);
    }
}

// Create a new placeholder
export const createPlaceholder = async (req, res) => {
    const { id } = req.params;
    const { name, minAmount, barcodeID, image } = req.body;
    try {
        const container = await Container.findById(id);

        if (!container) {
            return res.status(404).json({ message: 'Container not found' });
        }

        container.placeholders.push({ name, minAmount, barcodeID, image });

        await container.save();
        res.json({ message: 'Placeholder created successfully' });
    } catch (error) {
        errorHandler(error, res);
    }
}

// Create a new item
export const createItem = async (req, res) => {
    const { id } = req.params;
    const { placeholderID, amount, expirationDate } = req.body;
    
    try {
        const container = await Container.findById(id);

        if (!container) {
            return res.status(404).json({ message: 'Container not found' });
        }

        // Find the placeholder and then add the item
        const placeholder = container.placeholders.id(placeholderID);
        placeholder.items.push({ amount, expirationDate, placeholderID });
        await container.save();

        res.json({ message: 'Item created successfully' });
    } catch (error) {
        errorHandler(error, res);
    }
}

// Increase item amount
export const increaseItemAmount = async (req, res) => {
    const { id } = req.params;
    const { itemID, amount, placeholderID } = req.body;
    try {
        const container = await Container.findById(id);

        if (!container) {
            return res.status(404).json({ message: 'Container not found' });
        }

        // Find the placeholder and then add the item
        const placeholder = container.placeholders.id(placeholderID);
        const item = placeholder.items.id(itemID);
        item.amount = amount;
        await container.save();

        res.json({ message: 'Item amount increased successfully' });
    } catch (error) {
        errorHandler(error, res);
    }
}

export const deleteContainer = async (req, res) => {
    const { id } = req.params;
    try {
        await Container.findByIdAndDelete(id);
        res.json({ message: 'Container deleted successfully' });
    } catch (error) {
        console.error(error)
        errorHandler(error, res);
    }
}

export const deletePlaceholder = async (req, res) => {
    const { containerID, placeholderID } = req.params;
    try {
        const container = await Container.findById(containerID);
        if (!container) {
            return res.status(404).json({ message: 'Container not found' });
        }
        
        // Find the index of the placeholder
        const index = container.placeholders.findIndex(placeholder => placeholder._id.toString() === placeholderID);
        if (index === -1) {
            return res.status(404).json({ message: 'Placeholder not found' });
        }

        // Remove the placeholder from the array
        container.placeholders.splice(index, 1);

        await container.save();
        res.json({ message: 'Placeholder deleted successfully' });
    } catch (error) {
        console.error(error)
        errorHandler(error, res);
    }
}

export const deleteItem = async (req, res) => {
    const { containerID, placeholderID, itemID } = req.params;
    try {
        const container = await Container.findById(containerID);
        if (!container) {
            return res.status(404).json({ message: 'Container not found' });
        }

        // Find the placeholder
        const placeholder = container.placeholders.id(placeholderID);
        if (!placeholder) {
            return res.status(404).json({ message: 'Placeholder not found' });
        }

        // Find the item within the placeholder
        const itemIndex = placeholder.items.findIndex(item => item._id.toString() === itemID);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Remove the item from the placeholder
        placeholder.items.splice(itemIndex, 1);

        // Save the container to persist the changes
        await container.save();

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        errorHandler(error, res);
    }
}