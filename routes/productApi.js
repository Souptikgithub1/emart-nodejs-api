const express = require('express');
const router = express.Router();
const Product = require('../entities/product');


router.get('/', (req, res) => {
  let query = Product.find();
  query
  .then((product) => {
    res.send(product);
  });
});

router.post('/', (req, res) => {
  Product.create(req.body).then((product) => {
    res.send(product);
  });
});

router.delete('/:id', (req, res) => {
  Product.deleteOne({_id: req.params.id}, (err) => {
      res.send({id: req.params.id});
  });
});


module.exports = router;
