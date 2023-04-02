import mongoose from "mongoose";

const Product = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name."]
  },
  id: {
    type: Number,
    required: [true, "Please add name."]
  },
  keywords: {
    type: Array
  },
  energy: {
    type: Number
  },
  protein: {
    type: Number
  },
  totalFat: {
    type: Number
  },
  carbohydrate: {
    type: Number
  },
  percentageProtein: {
    type: Number
  },
  percentageTotalFat: {
    type: Number
  },
  percentageCarbohydrate: {
    type: Number
  },
  price: {
    type: String
  },
  priceSaving: {
    type: String
  },
  pricePerQuantity: {
    type: Number
  }
});

export default mongoose.model('Products', Product)