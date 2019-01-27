const mongoose = require('mongoose');

const productFeatureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    verticalId: Number,
    featureCategory: String,
    featureName: String,
    featureNameTag: String,
    featureUnit: String,
    featurePrefix: String,
    featureSuffix: String
});

module.exports = mongoose.model('ProductFeature', productFeatureSchema);