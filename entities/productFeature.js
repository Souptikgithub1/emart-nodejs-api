const mongoose = require('mongoose');

const productFeatureSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    verticalId: Number,
    category: String,
    name: String,
    keyFeatureState: Boolean,
    featureNameTag: String,
    featureUnit: String,
    featurePrefix: String,
    featureSuffix: String
});

module.exports = mongoose.model('ProductFeature', productFeatureSchema);