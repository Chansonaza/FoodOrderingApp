// Payment Microservice
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3003;

// POST - Process payment
app.post('/paymentprocess', (req, res) => {
  console.log('paymentprocess API called with body:', req.body);

  const { orderId, amount } = req.body;

  // Simple simulated payment logic:
  // Any amount greater than 0 is treated as a successful payment.
  // amount <= 0 (or missing) simulates a failed payment.
  const isSuccess = Number(amount) > 0;

  if (isSuccess) {
    return res.status(200).json({
      status: 'Success',
      message: `Payment of $${amount} for order ${orderId} processed successfully`,
      orderId,
      amount
    });
  } else {
    return res.status(200).json({
      status: 'Failure',
      message: `Payment for order ${orderId} failed`,
      orderId,
      amount
    });
  }
});

app.listen(PORT, () => {
  console.log(`Payment Service running on http://localhost:${PORT}`);
});
