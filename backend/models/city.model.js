import mongoose from "mongoose";

const citySchema = mongoose.Schema({
  city: { type: String, required: true },
  pos_x: { type: Number, required: true },
  pos_y: { type: Number, required: true },
});

const City = mongoose.model("City", citySchema);
export default City;
