import request from 'supertest';
import { Receipt } from '../receipt';
import { app, server } from '../index';

const validReceipts: string[] = []; // To store IDs of valid receipts


describe('API End-to-End Tests', () => {
    afterAll(() => {
        server.close();
    });

  // Test POST /receipts/process with valid receipt data
  it('should process a valid receipt and return a receipt ID', async () => {
    const receipt: Receipt = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" },
        { shortDescription: "Knorr Creamy Chicken", price: "1.26" },
        { shortDescription: "Doritos Nacho Cheese", price: "3.35" },
        { shortDescription: "Klarbrunn 12-PK 12 FL OZ", price: "12.00" }
      ],
      total: "35.35"
    };

    const response = await request(app).post('/receipts/process').send(receipt);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');

    validReceipts.push(response.body.id); // Storing ID for further tests
  });

  // Test GET /receipts/{id}/points with a valid receipt ID
  it('should return points for a valid receipt ID', async () => {
    if (validReceipts.length === 0) {
      throw new Error('No valid receipts available for testing.');
    }

    const receiptId = validReceipts[0];
    const response = await request(app).get(`/receipts/${receiptId}/points`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('points');
  });

  // Test GET /receipts/{id}/points with random invalid receipt ID, expected to receive 404 response
  it('should return 404 for a random invalid receipt ID', async () => {
    const randomId = '1234567890';
    const response = await request(app).get(`/receipts/${randomId}/points`);
    expect(response.status).toBe(404);
  });

  // Test POST /receipts/process with missing fields, expected to receive 400 response
  it('should return 400 for a receipt with missing fields', async () => {
    const receipts = [
      { // Missing retailer
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Item", price: "1.00" }],
        total: "1.00"
      },
      { // Missing purchaseDate
        retailer: "Target",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Item", price: "1.00" }],
        total: "1.00"
      },
      { // Missing purchaseTime
        retailer: "Target",
        purchaseDate: "2022-01-01",
        items: [{ shortDescription: "Item", price: "1.00" }],
        total: "1.00"
      },
      { // Missing items
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        total: "1.00"
      },
      { // Missing total
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Item", price: "1.00" }]
      }
    ];

    for (const receipt of receipts) {
      const response = await request(app).post('/receipts/process').send(receipt);
      expect(response.status).toBe(400);
    }
  });

  // Test POST /receipts/process with wrong receipt total, expected to receive 400 response  
  it('should process a valid receipt and return a receipt ID', async () => {
    const receipt: Receipt = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" },
        { shortDescription: "Knorr Creamy Chicken", price: "1.26" },
        { shortDescription: "Doritos Nacho Cheese", price: "3.35" },
        { shortDescription: "Klarbrunn 12-PK 12 FL OZ", price: "12.00" }
      ],
      total: "35.00"
    };

    const response = await request(app).post('/receipts/process').send(receipt);
    expect(response.status).toBe(400);

});

  // Test POST /receipts/process with incorrect input formats
  it('should return 400 for receipts with incorrect formats', async () => {
    const receipts = [
      { // Incorrect time format
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "25:00",
        items: [{ shortDescription: "Item", price: "1.00" }],
        total: "1.00"
      },
      { // Incorrect date format
        retailer: "Target",
        purchaseDate: "01-01-2022",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Item", price: "1.00" }],
        total: "1.00"
      },
      { // Incorrect retailer format
        retailer: "Target@123",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Item", price: "1.00" }],
        total: "1.00"
      },
      { // Incorrect total value
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Item", price: "1.00" }],
        total: "one"
      },
      { // Incorrect item description
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Item@123", price: "1.00" }],
        total: "1.00"
      }
    ];

    for (const receipt of receipts) {
      const response = await request(app).post('/receipts/process').send(receipt);
      expect(response.status).toBe(400);
    }
    
  });


  
});
