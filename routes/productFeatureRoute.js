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

module.exports = router;