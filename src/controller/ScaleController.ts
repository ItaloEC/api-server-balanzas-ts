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
    return this.scaleRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let scaleToRemove = await this.scaleRepository.findOne(request.params.id);
    await this.scaleRepository.remove(scaleToRemove);
  }
}
