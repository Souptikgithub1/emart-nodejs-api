const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// product schema
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  brand_id: Number,
  category_id: Number,
  vertical_id: Number,
  product_name: String,
  selling_rate: Number,
  mrp: Number,
  images: [String],
  state: Boolean,
  features:[{
    product_feature: {type: mongoose.Schema.Types.ObjectId, ref: 'Product_feature'},
    value: String
  }]
});

module.exports = mongoose.model('Product', productSchema);
