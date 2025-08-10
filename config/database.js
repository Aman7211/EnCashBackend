const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

exports.connectDB = async(req, res)=>{
    try {
     await mongoose.connect(process.env.MONGO_URI);
     console.log("MongoDb Database Connected Successfully");
    } catch (error) {
      console.log("Erorr in Connecting the database");
      console.error("Error is : ", error);
    }
}