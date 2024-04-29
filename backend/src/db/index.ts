import mongoose from "mongoose";
import { config } from "../config/config";
import { DB_NAME } from "../constants";



const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `\n Connected to MongoDB: ${connectionInstance.connection.host} \n`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED !! ", error);
    process.exit(1);
  }
};

export { connectDB };
