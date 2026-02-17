const express = require('express');
const router = express.Router();

// Static loan products data
const loanProducts = [
  {
    id: 'personal',
    name: 'Personal Loan',
    description: 'Instant approval for personal needs',
    features: ['No collateral required', 'Quick processing', 'Flexible tenure'],
  },
  {
    id: 'business',
    name: 'Business Loan',
    description: 'Fuel your business growth',
    features: ['High loan amounts', 'Competitive rates', 'Business-friendly terms'],
  },
  {
    id: 'home',
    name: 'Home Loan',
    description: 'Make your dream home a reality',
    features: ['Low interest rates', 'Long tenure options', 'Tax benefits'],
  },
  {
    id: 'lap',
    name: 'Loan Against Property',
    description: 'Leverage your property for funds',
    features: ['High loan-to-value ratio', 'Flexible repayment', 'Multiple use cases'],
  },
];

// GET /api/loan-products - Get all loan products
router.get('/', (req, res) => {
  res.json({
    success: true,
    products: loanProducts,
  });
});

// GET /api/loan-products/:id - Get single loan product
router.get('/:id', (req, res) => {
  const product = loanProducts.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }
  
  res.json({
    success: true,
    product,
  });
});

module.exports = router;
