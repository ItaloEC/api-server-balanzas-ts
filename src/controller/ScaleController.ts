import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Scale } from "../entity/Scale";

export class ScaleController {
  private scaleRepository = getRepository(Scale);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.scaleRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.scaleRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      let newScale: Scale = await this.scaleRepository.save(request.body);
      return response.status(200).json(newScale);
    } catch (error) {
      return response.status(400).json({ errorMessage: error });
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let scaleToRemove = await this.scaleRepository.findOne(request.params.id);
    if (scaleToRemove) {
      let res = await this.scaleRepository.remove(scaleToRemove);
      console.log(`res delete`, res);
      response.status(200).json({ message: "Balanza eliminada con exito" });
    } else {
      response.status(400).json({ errorMessage: "Error al eliminar balanza" });
    }
  }
}
