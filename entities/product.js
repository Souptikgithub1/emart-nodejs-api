const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// product schema
const productSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  brandId: Number,
  categoryId: Number,
  verticalId: Number,
  productName: String,
  sellingRate: Number,
  mrp: Number,
  images: [String],
  state: Boolean,
  features:[{
    productFeature: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductFeature'},
    value: String
  }],
  timestamp: Date
});

module.exports = mongoose.model('Product', productSchema);
