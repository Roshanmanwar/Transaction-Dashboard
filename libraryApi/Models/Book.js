const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
   id: Number,
   title: String,
   price: Number,
   description: String,
   category: String,
   image: String,
   sold: Boolean,
   dateOfSale: Date, 
});

module.exports = mongoose.model('Book', bookSchema);
