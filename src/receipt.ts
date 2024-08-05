import { v4 as uuidv4 } from 'uuid';

// Define the Item interface
export interface Item {
    shortDescription: string;
    price: string;
}

// Define the Receipt interface
export interface Receipt {
    retailer: string;
    purchaseDate: string;
    purchaseTime: string;
    items: Item[];
    total: string;
}

export class ReceiptService {
    private receiptStore: Map<string, Receipt>;

    constructor() {
        this.receiptStore = new Map<string, Receipt>();
    }

    // Method to process a receipt and return a receipt ID
    processReceipt(receipt: Receipt): string {
        const receiptId = uuidv4();
        this.receiptStore.set(receiptId, receipt);
        return receiptId;
    }

    // Method to calculate points for a receipt based on the given rules
    getPoints(receiptId: string): number | null {
        const receipt = this.receiptStore.get(receiptId);

        if (!receipt) {
            return null;
        }

        let points = 0;

        // 1 point for every alphanumeric character in the retailer name.
        points += this.calculateAlphanumericCharacters(receipt.retailer);

        // 50 points if the total is a round dollar amount with no cents.
        if (parseFloat(receipt.total) % 1 === 0) {
            points += 50;
        }

        // 25 points if the total is a multiple of 0.25.
        if (parseFloat(receipt.total) % 0.25 === 0) {
            points += 25;
        }

        // 5 points for every two items on the receipt.
        points += Math.floor(receipt.items.length / 2) * 5;

        // Points based on item description length being a multiple of 3.
        receipt.items.forEach(item => {
            const trimmedLength = item.shortDescription.trim().length;
            if (trimmedLength % 3 === 0) {
                points += Math.ceil(parseFloat(item.price) * 0.2);
            }
        });

        // 6 points if the day in the purchase date is odd.
        const purchaseDay = parseInt(receipt.purchaseDate.split('-')[2]);
        if (purchaseDay % 2 !== 0) {
            points += 6;
        }

        // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
        const purchaseHour = parseInt(receipt.purchaseTime.split(':')[0]);
        const purchaseMinute = parseInt(receipt.purchaseTime.split(':')[1]);
        if ((purchaseHour === 14) || (purchaseHour === 15 && purchaseMinute < 60)) {
            points += 10;
        }

        return points;
    }

    // Helper method to count alphanumeric characters in a string
    private calculateAlphanumericCharacters(input: string): number {
        return (input.match(/[a-zA-Z0-9]/g) || []).length;
    }
}

