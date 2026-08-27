# Food Ordering Microservices App

## Structure
```
FoodOrderingApp/
├── restaurant-service/   (port 3001)
├── order-service/        (port 3002)
├── payment-service/      (port 3003)
└── notification-service/ (port 3004)
```

## Setup (run once per service)
```bash
cd restaurant-service && npm install
cd ../order-service && npm install
cd ../payment-service && npm install
cd ../notification-service && npm install
```

## Run all 4 services (4 separate terminals — take a screenshot of each for Task 6)
```bash
# Terminal 1
cd restaurant-service && node index.js
# -> Restaurant Service running on http://localhost:3001

# Terminal 2
cd order-service && node index.js
# -> Order Service running on http://localhost:3002

# Terminal 3
cd payment-service && node index.js
# -> Payment Service running on http://localhost:3003

# Terminal 4
cd notification-service && node index.js
# -> Notification Service running on http://localhost:3004
```

## Postman tests (Task 7)

### Restaurant Service
| API | Method | URL |
|---|---|---|
| viewallrestaurant | GET | http://localhost:3001/viewallrestaurant |
| searchrestaurant | GET | http://localhost:3001/searchrestaurant?name=pizza |

### Payment Service
| API | Method | URL | Body (raw JSON) |
|---|---|---|---|
| paymentprocess | POST | http://localhost:3003/paymentprocess | `{"orderId":1,"amount":20}` |

### Notification Service
| API | Method | URL | Body (raw JSON) |
|---|---|---|---|
| sendnotification | POST | http://localhost:3004/sendnotification | `{"orderId":1,"status":"Success","message":"Test"}` |

### Order Service (this is the key screenshot — shows the full chain)
| API | Method | URL | Body (raw JSON) |
|---|---|---|---|
| addorder | POST | http://localhost:3002/addorder | `{"customerName":"NZ","item":"Margherita Pizza","amount":20}` |
| vieworder | GET | http://localhost:3002/vieworder | — |
| vieworder (single) | GET | http://localhost:3002/vieworder?orderId=1 | — |
| cancelorder | DELETE | http://localhost:3002/cancelorder | `{"orderId":1}` |

**For the "addorder calls paymentprocess then sendnotification" screenshot:**
1. Call `addorder` in Postman with a positive `amount` (e.g. 20) → payment "Success" → response includes `payment` and `notification` objects, both populated.
2. Call `addorder` again with `amount: 0` → payment "Failure" → response still includes a `notification` object, but with `status: "Failure"`.
3. Also screenshot the terminal running `order-service`, `payment-service`, and `notification-service` — their console logs show the request chain in real time (e.g. `Payment response received for order 1: Success`, then `sendnotification API called with body: {...}`).

## Flow implemented
```
User -> POST /addorder (Order Service)
     -> Order Service calls POST /paymentprocess (Payment Service)
     -> Payment Service returns Success/Failure to Order Service
     -> Order Service calls POST /sendnotification (Notification Service) with the result
     -> Order Service returns the combined result to the User
```
