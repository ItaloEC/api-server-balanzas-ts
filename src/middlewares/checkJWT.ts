import { Request, Response, NextFunction } from "express";

export function checkJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    next();
    console.log("====================================");
    console.log("autorizado");
    console.log("====================================");
  } else {
    console.log("====================================");
    console.log("não autorizado!!!");
    console.log("====================================");
    res.status(401).json({ errorMessage: "No autorizado" });
  }
}
