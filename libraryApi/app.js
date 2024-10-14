const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const cors = require('cors');
require('dotenv').config();



app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api', bookRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
