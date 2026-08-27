// Restaurant Microservice
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3001;

// Dummy in-memory restaurant data
const restaurants = [
  { id: 1, name: 'Pizza Palace', cuisine: 'Italian' },
  { id: 2, name: 'Sushi World', cuisine: 'Japanese' },
  { id: 3, name: 'Burger Hub', cuisine: 'American' }
];

// GET - View all restaurants
app.get('/viewallrestaurant', (req, res) => {
  console.log('viewallrestaurant API called');
  res.status(200).json({
    message: 'List of all restaurants',
    data: restaurants
  });
});

// GET - Search restaurant (by query param "name")
app.get('/searchrestaurant', (req, res) => {
  console.log('searchrestaurant API called');
  const { name } = req.query;
  res.status(200).json({
    message: `Search results for restaurant: ${name || '(no query provided)'}`,
    data: restaurants.filter(r =>
      name ? r.name.toLowerCase().includes(String(name).toLowerCase()) : true
    )
  });
});

app.listen(PORT, () => {
  console.log(`Restaurant Service running on http://localhost:${PORT}`);
});
