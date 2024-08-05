import express, { Request, Response } from 'express';
import { ReceiptService } from './receipt';
import {Receipt} from './receipt';

const app = express();
app.use(express.json());

const receiptService = new ReceiptService();

interface ReceiptCache {
    [id: string]: number; 
}

const receiptCache: ReceiptCache = {};

app.get('/', (req: Request, res: Response) => {
    res.send('Fetch Assignment');
});

// Endpoint to process a receipt
app.post('/receipts/process', (req: Request, res: Response) => {
    const receipt: Receipt = req.body;

    // Validate input types
        const validationError = validateReceipt(receipt);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const receiptId = receiptService.processReceipt(receipt);

        // Store the result
        receiptCache[receiptId] = receiptService.getPoints(receiptId) || 0;

        res.json({ id: receiptId });
});

// Endpoint to retrieve points by receipt ID
app.get('/receipts/:id/points', (req: Request, res: Response) => {
    const receiptId = req.params.id;

    // Retrieve points from the cache
    const points = receiptCache[receiptId];

    if (points !== undefined) {
        res.json({ points });
    } else {
        res.status(404).send('Invalid ID, receipt not found');
    }
});

// To validate the receipt input types
function validateReceipt(receipt: Receipt): string | null {

    // List of expected keys
    const expectedKeys = ["retailer", "total", "purchaseTime", "purchaseDate", "items"];

    // Check if all expected keys are present
    for (const key of expectedKeys) {
        if (!(key in receipt)) {
            return `Missing required field: ${key}`;
        }
    }

    // Check if items array is present and valid
    if (!Array.isArray(receipt.items) || receipt.items.length === 0) {
        return 'Items must be an array with at least one item';
    }

    const retailerPattern = /^[\w\s\-&]+$/;
    const totalPattern = /^\d+\.\d{2}$/;
    const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;


    if (!retailerPattern.test(receipt.retailer)) {
        return 'Invalid retailer format';
    }
    if (!totalPattern.test(receipt.total)) {
        return 'Invalid total format';
    }
    if (!timePattern.test(receipt.purchaseTime)) {
        return 'Invalid purchase time format';
    }
    if (!datePattern.test(receipt.purchaseDate)) {
        return 'Invalid purchase date format';
    }

    for (const item of receipt.items) {
        
        if (!item.shortDescription || !item.price) {
            return 'Missing required field in item';
        }
        const descriptionPattern = /^[\w\s\-]+$/;

        if (!descriptionPattern.test(item.shortDescription)) {
            return 'Invalid item description format';
        }
        if (!totalPattern.test(item.price)) {
            return 'Invalid item price format';
        }
    }

    if (!validateTotal(receipt)) {
        return 'Total amount is incorrect';
    }



    return null; // Validation is successful
}

// To validate the total amount in the receipt
function validateTotal(receipt: Receipt): boolean {
    const calculatedTotal = receipt.items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
    return calculatedTotal === receipt.total;
}

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export {app, server}
