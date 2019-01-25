const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../entities/product');
const ProductFeature = require('../entities/productFeature');

// 'features.product_feature': '5c4b389172656c13b0ff3187',
//     'features.value': {$in: ['2', '3']}

router.get('/', (req, res) => {
  Product.find({
    $or: [
      {$and: [ {'features.product_feature': '5c4b389172656c13b0ff3187'}, {  'features.value': {$in: ['2']}   } ]},
      {$and: [ {'features.product_feature': '5c4b188d1b29d41c70132a48'}, {  'features.value': {$in: ['8']}   } ]}
    ]
  })
  .populate('features.product_feature')
  .exec()
  .then((product) => {
    res.send(product);
  });
});

router.post('/', (req, res) => {
  let product = new Product(req.body);
  product._id = mongoose.Types.ObjectId();
  product.save().then(result => {
      res.status(200).json(result);
  }).catch(err => {
    console.log(err);
  });
});

router.delete('/:id', (req, res) => {
  Product.deleteOne({_id: req.params.id}, (err) => {
      res.send({id: req.params.id});
  });
});


module.exports = router;
