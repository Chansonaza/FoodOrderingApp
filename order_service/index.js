// Order Microservice
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = 3002;
const PAYMENT_SERVICE_URL = 'http://localhost:3003/paymentprocess';
const NOTIFICATION_SERVICE_URL = 'http://localhost:3004/sendnotification';

// In-memory order store
let orders = [];
let orderIdCounter = 1;

// POST - Add order
// Flow: User -> Order API -> Payment API -> Order API -> Notification API -> User
app.post('/addorder', async (req, res) => {
  console.log('addorder API called with body:', req.body);

  const { customerName, item, amount } = req.body;
  const orderId = orderIdCounter++;

  const newOrder = { orderId, customerName, item, amount, status: 'Pending' };
  orders.push(newOrder);

  try {
    // Step 1: Order API calls Payment Process API
    const paymentResponse = await axios.post(PAYMENT_SERVICE_URL, {
      orderId,
      amount
    });

    const paymentStatus = paymentResponse.data.status; // 'Success' or 'Failure'
    newOrder.status = paymentStatus === 'Success' ? 'Confirmed' : 'Payment Failed';

    console.log(`Payment response received for order ${orderId}: ${paymentStatus}`);

    // Step 2: Order API calls Notification Service API with the payment result
    const notificationResponse = await axios.post(NOTIFICATION_SERVICE_URL, {
      orderId,
      status: paymentStatus,
      message:
        paymentStatus === 'Success'
          ? `Your order #${orderId} was placed and payment succeeded.`
          : `Your order #${orderId} payment failed. Please try again.`
    });

    // Step 3: Order API responds back to the User
    res.status(200).json({
      message: 'Order processed',
      order: newOrder,
      payment: paymentResponse.data,
      notification: notificationResponse.data
    });
  } catch (error) {
    console.error('Error while processing order:', error.message);
    res.status(500).json({
      message: 'Order processing failed due to a service error',
      error: error.message
    });
  }
});

// GET - View order(s)
app.get('/vieworder', (req, res) => {
  console.log('vieworder API called');
  const { orderId } = req.query;

  if (orderId) {
    const order = orders.find(o => o.orderId === Number(orderId));
    return res.status(200).json({
      message: order ? `Order ${orderId} found` : `Order ${orderId} not found`,
      data: order || null
    });
  }

  res.status(200).json({
    message: 'All orders',
    data: orders
  });
});

// DELETE - Cancel order
app.delete('/cancelorder', (req, res) => {
  console.log('cancelorder API called with body:', req.body);
  const { orderId } = req.body;

  const order = orders.find(o => o.orderId === Number(orderId));
  if (!order) {
    return res.status(404).json({ message: `Order ${orderId} not found` });
  }

  order.status = 'Cancelled';
  res.status(200).json({
    message: `Order ${orderId} cancelled successfully`,
    data: order
  });
});

app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
