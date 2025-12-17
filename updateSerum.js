const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Product = require('./Models/productModel');
    
    const result = await Product.updateOne(
      { name: /hydrating face serum/i },
      { 
        $set: { 
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
        }
      }
    );
    
    console.log('Update result:', result);
    console.log('Hydrating Face Serum image updated!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
