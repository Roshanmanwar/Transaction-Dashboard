const express = require('express');
const router = express.Router();
const Book = require('../Models/Book');
const axios = require('axios');
router.post('/books', async (req, res) => {
   try {
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const booksData = response.data;

      const savedBooks = await Book.insertMany(booksData.map(item => ({
         id: item.id,
         title: item.title,
         price: item.price,
         description: item.description,
         category: item.category,
         image: item.image,
         sold: item.sold,
         dateOfSale: new Date(item.dateOfSale)
      })));

      res.status(201).json(savedBooks);
   } catch (error) {
      res.status(500).json({ message: 'Error creating books', error });
   }
});



router.get('/books', async (req, res) => {
   const { page = 1, limit = 10, search = '', month } = req.query;

   try {
      let filter = {
         $or: [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
         ],
      };

      if (month) {
         const startDate = new Date(2021, parseInt(month) - 1, 1);
         const endDate = new Date(2022, parseInt(month), 1);

         filter = {
            ...filter,
            dateOfSale: { $gte: startDate, $lt: endDate },
         };
      }

      const books = await Book.find(filter)
         .limit(limit * 1)
         .skip((page - 1) * limit);

      const total = await Book.countDocuments(filter);

      res.json({ total, books });
   } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error });
   }
});

router.put('/books/:id', async (req, res) => {
   try {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedBook) {
         return res.status(404).json({ message: 'Book not found' });
      }
      res.json(updatedBook);
   } catch (error) {
      res.status(500).json({ message: 'Error updating book', error });
   }
});


router.delete('/books/:id', async (req, res) => {
   try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) {
         return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book deleted' });
   } catch (error) {
      res.status(500).json({ message: 'Error deleting book', error });
   }
});
router.get('/books/statistics/:month', async (req, res) => {
   const { month } = req.params;


   const parsedMonth = parseInt(month, 10);

   if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ message: 'Invalid month. Please provide a month between 1 and 12.' });
   }

   const startDate = new Date(2021, parsedMonth - 1, 1);
   const endDate = new Date(2022, parsedMonth, 1);


   try {
      const booksForMonth = await Book.find({
         dateOfSale: { $gte: startDate, $lt: endDate }
      });


      const totalSaleAmount = booksForMonth.reduce((total, book) => total + (book.sold ? book.price : 0), 0);
      const totalSoldItems = booksForMonth.filter(book => book.sold).length;
      const totalNotSoldItems = booksForMonth.filter(book => !book.sold).length;

      res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
   } catch (error) {
      res.status(500).json({ message: 'Error fetching statistics', error });
   }
});



router.get('/books/bar-chart/:month', async (req, res) => {
   const { month } = req.params;
   const parsedMonth = parseInt(month, 10);
   if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ message: 'Invalid month. Please provide a month between 1 and 12.' });
   }

   const startDate = new Date(2021, parsedMonth - 1, 1);
   const endDate = new Date(2022, parsedMonth, 1);

   try {
      const booksForMonth = await Book.find({
         dateOfSale: { $gte: startDate, $lt: endDate }
      });

      const priceRanges = {
         '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0,
         '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901+': 0
      };

      booksForMonth.forEach(book => {
         const price = book.price;
         if (price <= 100) priceRanges['0-100']++;
         else if (price <= 200) priceRanges['101-200']++;
         else if (price <= 300) priceRanges['201-300']++;
         else if (price <= 400) priceRanges['301-400']++;
         else if (price <= 500) priceRanges['401-500']++;
         else if (price <= 600) priceRanges['501-600']++;
         else if (price <= 700) priceRanges['601-700']++;
         else if (price <= 800) priceRanges['701-800']++;
         else if (price <= 900) priceRanges['801-900']++;
         else priceRanges['901+']++;
      });

      res.json(priceRanges);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching bar chart data', error });
   }
});


router.get('/books/pie-chart/:month', async (req, res) => {
   const { month } = req.params;
   const parsedMonth = parseInt(month, 10);
   const year = 2021;

   if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ message: 'Invalid month. Please provide a month between 1 and 12.' });
   }

   const startDate = new Date(year, parsedMonth - 1, 1);
   const endDate = new Date(year, parsedMonth, 1);

   try {
      const booksForMonth = await Book.find({
         dateOfSale: { $gte: startDate, $lt: endDate }
      });

      const categoryCounts = {};
      booksForMonth.forEach(book => {
         if (book.category) {
            categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
         }
      });

      res.json(categoryCounts);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching pie chart data', error });
   }
});
router.get('/books/combined/:month', async (req, res) => {
   const { month } = req.params;
   const parsedMonth = parseInt(month, 10);
   const year = 2021;
   if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ message: 'Invalid month. Please provide a month between 1 and 12.' });
   }

   const startDate = new Date(year, parsedMonth - 1, 1);
   const endDate = new Date(year, parsedMonth, 1);

   try {
      const booksForMonth = await Book.find({
         dateOfSale: { $gte: startDate, $lt: endDate }
      });

      const totalSaleAmount = booksForMonth.reduce((total, book) => total + (book.sold ? book.price : 0), 0);
      const totalSoldItems = booksForMonth.filter(book => book.sold).length;
      const totalNotSoldItems = booksForMonth.filter(book => !book.sold).length;

      const statistics = { totalSaleAmount, totalSoldItems, totalNotSoldItems };

      const priceRanges = {
         '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0,
         '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901+': 0
      };

      booksForMonth.forEach(book => {
         const price = book.price;
         if (price <= 100) priceRanges['0-100']++;
         else if (price <= 200) priceRanges['101-200']++;
         else if (price <= 300) priceRanges['201-300']++;
         else if (price <= 400) priceRanges['301-400']++;
         else if (price <= 500) priceRanges['401-500']++;
         else if (price <= 600) priceRanges['501-600']++;
         else if (price <= 700) priceRanges['601-700']++;
         else if (price <= 800) priceRanges['701-800']++;
         else if (price <= 900) priceRanges['801-900']++;
         else priceRanges['901+']++;
      });

      const categoryCounts = {};
      booksForMonth.forEach(book => {
         if (book.category) {
            categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
         }
      });

      const combinedData = {
         statistics,
         priceRanges,
         categoryCounts
      };

      res.json(combinedData);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching combined data', error });
   }
});


module.exports = router;
