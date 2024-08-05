import { ReceiptService } from '../receipt';
import { Receipt } from '../receipt'; 

describe('Receipt Score Calculation Test', () => {

  let receiptService = new ReceiptService();

  it('It should calculate 28 points for this receipt', () => {
    const receipt: Receipt = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: "6.49"
        },
        {
          shortDescription: "Emils Cheese Pizza",
          price: "12.25"
        },
        {
          shortDescription: "Knorr Creamy Chicken",
          price: "1.26"
        },
        {
          shortDescription: "Doritos Nacho Cheese",
          price: "3.35"
        },
        {
          shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
          price: "12.00"
        }
      ],
      total: "35.35"
    };

    const receiptId = receiptService.processReceipt(receipt);
    const points = receiptService.getPoints(receiptId);

    expect(points).toBe(28);
  });

  it('It should calculate 109 points for this receipt', () => {
    const receipt: Receipt = {
      retailer: "M&M Corner Market",
      purchaseDate: "2022-03-20",
      purchaseTime: "14:33",
      items: [
        {
          shortDescription: "Gatorade",
          price: "2.25"
        },
        {
          shortDescription: "Gatorade",
          price: "2.25"
        },
        {
          shortDescription: "Gatorade",
          price: "2.25"
        },
        {
          shortDescription: "Gatorade",
          price: "2.25"
        }
      ],
      total: "9.00"
    };

    const receiptId = receiptService.processReceipt(receipt);
    const points = receiptService.getPoints(receiptId);

    expect(points).toBe(109);
  });

 // Additional custom receipt test
  it('It should calculate 101 points for this receipt', () => {
    const receipt: Receipt = {
            "retailer": "McDonalds",
            "purchaseDate": "2023-08-04",
            "purchaseTime": "14:53",
            "items": [
              {
                "shortDescription": "McChicken",
                "price": "2.60"
              },{
                "shortDescription": "Cheeseburger",
                "price": "4.95"
              },{
                "shortDescription": "Oreo McFlurry",
                "price": "5.45"
              }
            ],
            "total": "13.00"
    };

    const receiptId = receiptService.processReceipt(receipt);
    const points = receiptService.getPoints(receiptId);

    expect(points).toBe(101);
  });


});
