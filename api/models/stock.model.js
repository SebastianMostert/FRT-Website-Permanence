import mongoose from 'mongoose';

const itemObject = {
    placeholderID: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
};

const placeHolderObject = {
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    minAmount: {
        type: Number,
        required: true,
    },
    barcodeID: {
        type: String,
        required: true,
    },
    items: {
        type: [itemObject],
        required: true,
        default: [],
    },
};

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    placeholders: {
        type: [placeHolderObject],
        required: true,
        default: [],
    }
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;