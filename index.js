const express = require('express');
const mongoose = require('mongoose');
const categoryRoutes = require('./routes/categoryRoutes'); // import routes
const bodyParser = require('body-parser');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/categories', categoryRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start server after DB connects
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
  });
})
.catch(err => {
  console.error('Database connection error:', err);
});