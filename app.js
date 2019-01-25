const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


mongoose.connect('mongodb://emart:1234@emart-shard-00-00-qhpg9.mongodb.net:27017,emart-shard-00-01-qhpg9.mongodb.net:27017,emart-shard-00-02-qhpg9.mongodb.net:27017/emart?ssl=true&replicaSet=emart-shard-0&authSource=admin&retryWrites=true',
                  { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.pluralize(null);
let db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to Mongo db');
});
db.on('error', (err) => {
  console.log(err);
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// allroutes
app.use('/products', require('./routes/productRoute'));
app.use('/productFeatures', require('./routes/productFeatureRoute'));

//Welcome route
app.use((req, res, next) => {
  res.send("<h1>Welcome</h1>");
});

const port = process.env.PORT || 3200;
app.listen(port || 3200, () => {
  console.log('nodejs server started at port ' + port);
});
