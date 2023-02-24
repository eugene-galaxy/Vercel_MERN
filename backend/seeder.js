import mongoose from "mongoose";
import connectDB from "./config/db.js";
import City from "./models/city.model.js";
import cities from "./seed/city.js";

mongoose.set("strictQuery", false);
await connectDB();

const importData = async () => {
  try {
    await City.insertMany(cities);
    console.log("Data Imported");
    process.exit();
  } catch (err) {
    console.log(`Error: ${err}`);
    process.exit(1);
  }
};

importData();
