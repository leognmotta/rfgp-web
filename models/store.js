const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  storeName: {
    type: String,
    required: true
  },
  users: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  carts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;
