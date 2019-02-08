const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  costumer: {
    type: String
  },
  products: [
    {
      product: {
        title: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      },
      quantity: { type: Number, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
