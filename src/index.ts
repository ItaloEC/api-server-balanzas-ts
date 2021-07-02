import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { scaleList } from "./data/ScaleList";
import { ScaleType } from "./types/ScaleType";
import { crossOriginResourcePolicy } from "helmet";
var cors = require("cors");

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    var http = require("http").createServer(app);
    var io = require("socket.io")(http);

    setInterval(() => {
      io.emit("weight-server-for-front", scaleList);
    }, 2000);

    io.on("connection", (socket) => {
      console.log("************* new client connected");

      let scaleFromRaspberry: ScaleType;

      socket.on("weight-server", (data) => {
        scaleFromRaspberry = data;
        scaleFromRaspberry.status = "online";

        let scaleIndex = scaleList.findIndex(
          (scale) => scale.scaleName === scaleFromRaspberry.scaleName
        );

        console.log(`scaleIndex`, scaleIndex);

        if (scaleIndex < 0) {
          scaleList.push(scaleFromRaspberry);
        } else {
          scaleList[scaleIndex].weight = scaleFromRaspberry.weight;
        }

        // console.log(`scaleList`, scaleList);
      });

      socket.on("disconnect", () => {
        console.log("client disconnected");

        let scaleIndex = scaleList.findIndex(
          (scale) => scale.scaleName === scaleFromRaspberry.scaleName
        );

        if (scaleIndex) {
          scaleList[scaleIndex].status = "offline";
        }
      });
    });

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    http.listen(3005, () => {
      console.log(`Server listening at http://localhost:${3005}`);
    });
  })
  .catch((error) => console.log(error));
