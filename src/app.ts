import "./env";
import * as process from "process";
import express, { json } from "express";
import mongoose from "mongoose";
import routers from "./routes";
import { tmpAuth } from "./tmp";
import { Request, Response, NextFunction } from "express";
const { PORT = 3000, MONGO_URL = "none" } = process.env;

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(tmpAuth);

app.use("/", routers);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.send({ message: err.message });
});

async function connection() {
  try {
    await mongoose.connect(MONGO_URL);
    app.listen(PORT, () => console.log("Server started!"));
  } catch (err) {
    console.log(err);
  }
}

connection();
