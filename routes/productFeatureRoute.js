const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductFeature = require('../entities/productFeature');

router.post('/', (req, res) => {
    let productFeature = new ProductFeature(req.body);
    productFeature.id = mongoose.Types.ObjectId();
    productFeature.save().then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    });
});

router.post('/addAll', (req, res) => {
    const reqBody = req.body;
    let productFeatures = [];
    for(const elem of reqBody){
        let productFeature = new ProductFeature(elem);
        productFeature.id = mongoose.Types.ObjectId();
        productFeatures.push(productFeature);
    }
    
    console.log(productFeatures);
    ProductFeature.insertMany(productFeatures).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err);
    });
});

module.exports = router;