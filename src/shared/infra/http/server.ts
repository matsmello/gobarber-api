import "reflect-metadata";

import express, { NextFunction, Response, Request } from "express";
import "express-async-errors";
import cors from "cors";

import routes from "./routes";
import uploadConfig from "@config/upload";
import "../typeorm";
import AppError from "@shared/errors/AppError";
import '@shared/container'

const app = express();

app.use(cors());
app.use(express.json());
app.use("/files", express.static(uploadConfig.tmpDir));
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    return response
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
);

app.listen(3333, () => {
  console.log("✌🏻Server started");
});
