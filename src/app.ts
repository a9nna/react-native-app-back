import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import createDebug from "debug";
import routes from "./server/routes/routes.js";

const app = express();
const debug = createDebug("app");
const serverPort = process.env.PORT || 3000;
const mongoConnection = process.env.DATABASE;

app.use(express.json());
app.use("/recipes", routes);

mongoose
  .connect(mongoConnection!)
  .then(() => {
    debug(`Database connected successfully`);

    app.listen(serverPort, () => {
      debug(`Server is running on port: ${serverPort}`);
    });
  })
  .catch((error) => {
    debug(`Error connecting to database: ${error}`);
  });
