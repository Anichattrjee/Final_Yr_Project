const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
	
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
	
const PORT = process.env.PORT || 8000;
	
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
	.catch(err => console.error(err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
    
const votingRoutes = require('./routes/voting');
app.use('/api/voting', votingRoutes);

	
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
