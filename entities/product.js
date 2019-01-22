const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// product schema
const productSchema = new Schema({
  brand_id: {type: Number},
  category_id: {type: Number},
  vertical_id: {type: Number},
  product_name: {type: String},
  selling_rate: {type: Number},
  mrp: {type: Number},
  images: [String],
  state: Boolean,
  feature_category_list: [
      {
        feature_category_name: {type: String},
         feature_list: [
           {
             feature_name: {type: String},
             feature_value: {type: String},
             feature_unit: {type: String},
             feature_prefix: {type: String},
             feature_suffix: {type: String}
           }
      ]
    }
  ]
});

const Product = mongoose.model('em_products', productSchema);
module.exports = Product;
