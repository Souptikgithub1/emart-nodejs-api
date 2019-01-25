const mongoose = require('mongoose');

const productFeatureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vertical_id: Number,
    feature_category: String,
    feature_name: String,
    feature_name_tag: String,
    feature_unit: String,
    feature_prefix: String,
    feature_suffix: String
});

module.exports = mongoose.model('Product_feature', productFeatureSchema);