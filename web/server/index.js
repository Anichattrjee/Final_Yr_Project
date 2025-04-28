const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser=require("cookie-parser");
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const electionRoutes=require("./routes/elections.js");
const adminRoutes = require('./routes/admin');


dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evoting')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to eVoting API' });
});


// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!'+err.message });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});