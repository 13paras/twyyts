import { connectDB } from "./db";
import { app } from "./app";
import { config } from "./config/config";


// connecting to mongoDB
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERRRRRRRR: ", error);
      throw error;
    });
    app.listen(config.PORT, () => {
      console.log(`Server is running at port `, process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection failed !!", err.message);
  });
