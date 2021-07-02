import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Registry } from "../entity/Registry";

export class RegistryController {
  private registryRepository = getRepository(Registry);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.registryRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.registryRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    console.log("====================================");
    console.log(request.body);
    console.log("====================================");
    return this.registryRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let registryToRemove = await this.registryRepository.findOne(
      request.params.id
    );
    await this.registryRepository.remove(registryToRemove);
  }
}
