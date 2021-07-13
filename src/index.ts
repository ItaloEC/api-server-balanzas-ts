import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { scaleList } from "./data/ScaleList";
import { ScaleType } from "./types/ScaleType";
const _ = require("lodash");
import { checkJWT } from "./middlewares/checkJWT";
import { Scale } from "./entity/Scale";
import { User } from "./entity/User";
var cors = require("cors");

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    // app.use(checkJWT);

    var http = require("http").createServer(app);
    var io = require("socket.io")(http);

    setInterval(() => {
      (async () => {
        let scaleListFromDB = await getRepository(Scale).find();

        var merged = _.merge(
          _.keyBy(scaleListFromDB, "name"),
          _.keyBy(scaleList, "name")
        );
        var values = _.values(merged);

        // console.log(`scaleListFromDB`, scaleListFromDB);
        // console.log(`scaleList`, scaleList);
        // console.log(`values`, values);

        io.emit("weight-server-for-front", values);
      })();
    }, 2000);

    io.on("connection", (socket) => {
      console.log("************* new client connected");

      console.log("====================================");
      console.log("socket.id", socket.id);
      console.log("====================================");

      socket.on("weight-server", (data) => {
        let scaleFromRaspberry = {
          name: data.scaleName,
          socketId: socket.id,
          weight: data.weight,
          status: "online",
        };

        let scaleIndex = scaleList.findIndex(
          (scale) => scale.name === scaleFromRaspberry.name
        );

        // console.log(`scaleIndex`, scaleIndex);

        if (scaleIndex < 0) {
          scaleList.push(scaleFromRaspberry);
        } else {
          scaleList[scaleIndex].socketId = socket.id;
          scaleList[scaleIndex].weight = scaleFromRaspberry.weight;
          scaleList[scaleIndex].status = "online";
        }

        // console.log(`scaleList`, scaleList);
      });

      socket.on("disconnect", () => {
        console.log("client disconnected");

        console.log("====================================");
        console.log("Disconnected ===> ", socket.id);
        console.log("====================================");

        let scaleIndex = scaleList.findIndex(
          (scale) => scale.socketId === socket.id
        );

        console.log(`scaleIndex`, scaleList.length);

        if (scaleIndex >= 0) {
          scaleList.splice(scaleIndex, 1);
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

    (async () => {
      let list = await getRepository(User).find();
      if (list.length == 0) {
        await getRepository(User).save({
          email: "dcabrerag@gmail.com",
          name: "Dennis",
          password: "123456",
        });
        console.log("First user saved");
      }
    })();

    // setup static files
    app.use(express.static("build"));

    // start express server
    http.listen(3005, () => {
      console.log(`Server listening at http://localhost:${3005}`);
    });
  })
  .catch((error) => console.log(error));
