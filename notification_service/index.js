// Notification Microservice
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3004;

// POST - Send notification to user
app.post('/sendnotification', (req, res) => {
  console.log('sendnotification API called with body:', req.body);

  const { orderId, status, message } = req.body;

  console.log(`Notification sent to user -> Order: ${orderId}, Status: ${status}, Message: ${message}`);

  res.status(200).json({
    message: 'Notification sent successfully',
    notification: {
      orderId,
      status,
      text: message || `Your order ${orderId} status is: ${status}`
    }
  });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on http://localhost:${PORT}`);
});
