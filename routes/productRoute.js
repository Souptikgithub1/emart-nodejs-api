const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../entities/product');
const ProductFeature = require('../entities/productFeature');

// 'features.product_feature': '5c4b389172656c13b0ff3187',
//     'features.value': {$in: ['2', '3']}

router.post('/search', (req, res) => {

  const requestBody = req.body;

  //console.log(requestBody);

  const categoryId = !!requestBody.categoryId ? requestBody.categoryId : 0;
  const verticalId = !!requestBody.verticalId ? requestBody.verticalId : 0;

  const minPrice = !!requestBody.minPrice ? requestBody.minPrice : 0;
  const maxPrice = !!requestBody.maxPrice ? requestBody.maxPrice : 100000000;

  const page = !!requestBody.page ? requestBody.page : 0;
  const size = !!requestBody.size ? requestBody.size : 15;
  const sort = !!requestBody.sort ? requestBody.sort : 'price_asc';


  let conditionList = {};
  let conditionListForPriceRange = {};

  if(!!categoryId && categoryId != 0){
    console.log('catId', categoryId);
    Object.assign(conditionList, {'$and': [{'categoryId': categoryId}]});
  }

  if(!!verticalId && verticalId !=0){
    console.log('vertId', categoryId);
    Object.assign(conditionList, {'$and': [{'verticalId': verticalId}]});
  }


  conditionListForPriceRange = conditionList;
  if(maxPrice > 0){
    conditionList['$and'].push({'sellingRate': {'$gt': minPrice, '$lt': maxPrice} });
  }

  // {
  //   '$or': [
  //     {'$and': [ {'features.productFeature': '5c4d6307db85dc08402f50fe'}, {  'features.value': {'$in': ['2']}   } ]},
  //     {'$and': [ {'features.productFeature': '5c4d633cdb85dc08402f50ff'}, {  'features.value': {'$in': ['8']}   } ]}
  //   ]
  // }


  Product.countDocuments(conditionList).exec().then(totalCount => {
    
    //Object.assign(conditionListForPriceRange['$and'], {'$max': 'sellingRate'});
    Product.find(conditionListForPriceRange).sort({'sellingRate': 1}).select('sellingRate').exec()
    .then(result => {
      const minPriceRange = !!result[0] ? result[0]['sellingRate'] : 0;
      const maxPriceRange = !!result[result.length-1] ? result[result.length-1]['sellingRate'] : 10000000;
    
        Product.find(conditionList).populate('features.productFeature').exec().then((products) => {
          //console.log(products);
          
          let searchResultResponse = {
            noOfPages: 1,
            startCount: page * size + 1,
            endCount: page * size + products.length,
            totalProductCount: totalCount,
            productDetailsBeans: products,
            minPrice: minPriceRange,
            maxPrice: maxPriceRange
          };
          res.status(200).json(searchResultResponse);
        });
    
    
    }).catch();

    
  
  }).catch(err => {console.log(err)});

  
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
