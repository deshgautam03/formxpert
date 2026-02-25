const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/formxpert')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('FormXpert API is running');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
