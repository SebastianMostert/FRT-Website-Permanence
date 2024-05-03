import { toast } from "react-toastify"

/**
 * Container:
 * * name
 * * image
 * * placeholders
 * * * image
 * * * name
 * * * minAmount
 * * * barcodeID
 * * * items
 * * * * placeholderID
 * * * * amount
 * * * * expirationDate
 */

// Get the containers
export const getContainers = async () => {
    const response = await fetch('/api/v1/stock/containers/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await response.json();
    return data;
}

// Get the container by ID
export const getContainerById = async (id) => {
    // Get all containers
    const containers = await getContainers();
    const container = await containers.find(container => container._id === id);
    return container;
}

// Get placeholder by container id and placeholder id
export const getPlaceholderById = async (containerId, placeholderId) => {
    const container = await getContainerById(containerId);
    const placeholder = await container.placeholders.find(placeholder => placeholder._id === placeholderId);
    return placeholder;
}

// Create a container
export const createContainer = async (name, image) => {
    const response = await fetch('/api/v1/stock/containers/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            image
        })
    })

    if (await response.ok) {
        toast.success('Container created successfully');
    } else {
        toast.error('Failed to create container');
    }
}

// Create a placeholder
export const createPlaceholder = async (containerId, name, minAmount, barcodeID, image) => {
    const response = await fetch(`/api/v1/stock/placeholders/create/${containerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            minAmount,
            barcodeID,
            image
        })
    })

    if (await response.ok) {
        toast.success('Container created successfully');
    } else {
        toast.error('Failed to create container');
    }
}

// Create an item
export const createItem = async (containerID, amount, expirationDate, placeholderID) => {
    const response = await fetch(`/api/v1/stock/items/create/${containerID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            placeholderID,
            amount,
            expirationDate
        })
    })

    if (await response.ok) {
        toast.success('Item created successfully');
    } else {
        toast.error('Failed to create item');
    }
}

// Increase the amount of an item
export const increaseItemAmount = async (itemID, amount, containerID, placeholderID) => {
    if(amount <= 0) {
        deleteItem(containerID, placeholderID, itemID);
        return;
    }

    const response = await fetch(`/api/v1/stock/items/update/${containerID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            itemID,
            amount,
            placeholderID
        })
    })

    if (!(await response.ok)) {
        toast.error('Failed to create item');
    }
}

// Delete container
export const deleteContainer = async (containerID) => {
    const response = await fetch(`/api/v1/stock/containers/delete/${containerID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    if (await response.ok) {
        toast.success('Container deleted successfully');
    } else {
        toast.error('Failed to delete container');
    }
}

// Delete Placeholder
export const deletePlaceholder = async (containerID, placeholderID) => {
    const response = await fetch(`/api/v1/stock/placeholders/delete/${containerID}/${placeholderID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    if (await response.ok) {
        toast.success('Placeholder deleted successfully');
    } else {
        toast.error('Failed to delete placeholder');
    }
}

// Delete Item
export const deleteItem = async (containerID, placeholderID, itemID) => {
    const response = await fetch(`/api/v1/stock/items/delete/${containerID}/${placeholderID}/${itemID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    if (await response.ok) {
        toast.success('Item deleted successfully');
    } else {
        toast.error('Failed to delete item');
    }
}

export const imageURL = 'https://i.imgur.com/Pwd8S3K.png'