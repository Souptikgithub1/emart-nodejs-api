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
  let sortArr = sort.split('_');
  let sortBy = {'sellingRate': 1};
  if(sortArr[0] == 'price' && sortArr[1] == 'asc'){
    sortBy = {'sellingRate': 1};
  }else if(sortArr[0] == 'price' && sortArr[1] == 'desc'){
    sortBy = {'sellingRate': -1};
  }
  


  let conditionList = {};
  let conditionListForPriceRange = '';

  if(!!categoryId && categoryId != 0){
    Object.assign(conditionList, {'$and': [{'categoryId': categoryId}]});
  }

  if(!!verticalId && verticalId !=0){
    Object.assign(conditionList, {'$and': [{'verticalId': verticalId}]});
  }



  Product.find(conditionList)
  .populate('features.productFeature')
  .sort({'sellingRate': 1}).exec()
  .then(totalProducts => {
    let totalCount = totalProducts.length;
    let minPriceRange = !!totalProducts[0] ? totalProducts[0]['sellingRate'] : 0;
    let maxPriceRange = !!totalProducts[totalProducts.length-1] ? totalProducts[totalProducts.length-1]['sellingRate'] : 10000000;
  
    
    totalProducts.sort((a,b) => {
      if(sort === 'price_asc') return a.sellingRate - b.sellingRate;
      if(sort === 'price_desc') return b.sellingRate - a.sellingRate;
    });
    totalProducts = totalProducts.slice(page*size, (page+1)*size);
    let searchResultResponse = {
      noOfPages: (totalCount%size == 0) ? totalCount/size - 1 : totalCount/size,
      startCount: page * size + 1,
      endCount: page * size + totalProducts.length,
      totalProductCount: totalCount,
      productDetailsBeans: totalProducts,
      minPrice: minPriceRange,
      maxPrice: maxPriceRange
    };
    res.status(200).json(searchResultResponse);
  
  }).catch(err => console.log(err));

    







    

  
});

router.post('/', (req, res) => {
  let product = new Product(req.body);
  product.id = mongoose.Types.ObjectId();
  product.timestamp = Date.now();

  product.save().then(result => {
      res.status(200).json(result);
  }).catch(err => {
    console.log(err);
  });
});

router.delete('/:id', (req, res) => {
  Product.deleteOne({id: req.params.id}, (err) => {
      res.send({id: req.params.id});
  });
});


router.post('/search2', (req, res) => {

  const requestBody = req.body;

  //console.log(requestBody);

  const categoryId = !!requestBody.categoryId ? requestBody.categoryId : 0;
  const verticalId = !!requestBody.verticalId ? requestBody.verticalId : 0;

  const minPrice = !!requestBody.minPrice ? requestBody.minPrice : 0;
  const maxPrice = !!requestBody.maxPrice ? requestBody.maxPrice : 100000000;

  const page = !!requestBody.page ? requestBody.page : 0;
  const size = !!requestBody.size ? requestBody.size : 15;
  const sort = !!requestBody.sort ? requestBody.sort : 'price_asc';
  let sortArr = sort.split('_');
  let sortBy = {'sellingRate': 1};
  if(sortArr[0] == 'price' && sortArr[1] == 'asc'){
    sortBy = {'sellingRate': 1};
  }else if(sortArr[0] == 'price' && sortArr[1] == 'desc'){
    sortBy = {'sellingRate': -1};
  }
  


  let conditionList = {};
  let conditionListForPriceRange = '';

  if(!!categoryId && categoryId != 0){
    Object.assign(conditionList, {'$and': [{'categoryId': categoryId}]});
  }

  if(!!verticalId && verticalId !=0){
    Object.assign(conditionList, {'$and': [{'verticalId': verticalId}]});
  }


  conditionListForPriceRange = JSON.stringify(conditionList);
  if(maxPrice > 0){
    const priceRangeCondition = {'sellingRate': {'$gte': minPrice, '$lte': maxPrice} };
    if(!!conditionList.hasOwnProperty('$and')){
      conditionList['$and'].push(priceRangeCondition);
    }else{
      Object.assign(conditionList, {'$and': [priceRangeCondition]});
    }
    
  }

  // {
  //   '$or': [
  //     {'$and': [ {'features.productFeature': '5c4d6307db85dc08402f50fe'}, {  'features.value': {'$in': ['2']}   } ]},
  //     {'$and': [ {'features.productFeature': '5c4d633cdb85dc08402f50ff'}, {  'features.value': {'$in': ['8']}   } ]}
  //   ]
  // }

  let totalCount;
  let minPriceRange;
  let maxPriceRange;
  Product.countDocuments(conditionList).exec().then(totalCountResponse => {
    totalCount = totalCountResponse;
    console.log(totalCountResponse);
    //Object.assign(conditionListForPriceRange['$and'], {'$max': 'sellingRate'});
    return Product.find(JSON.parse(conditionListForPriceRange)).sort({'sellingRate': 1}).select('sellingRate').exec();
    })
    .then(result => {
      minPriceRange = !!result[0] ? result[0]['sellingRate'] : 0;
      maxPriceRange = !!result[result.length-1] ? result[result.length-1]['sellingRate'] : 10000000;

      return Product.find(conditionList)
        .populate('features.productFeature')
        .skip(page * size)
        .limit(size)
        .sort(sortBy)
        .exec()
    })
    .then(products => {
      console.log(products);
      let searchResultResponse = {
        noOfPages: (totalCount%size == 0) ? totalCount/size - 1 : totalCount/size,
        startCount: page * size + 1,
        endCount: page * size + products.length,
        totalProductCount: totalCount,
        productDetailsBeans: products,
        minPrice: minPriceRange,
        maxPrice: maxPriceRange
      };
      res.status(200).json(searchResultResponse);
    })
    .catch(err => console.log(err));

    







    

  
});



module.exports = router;
