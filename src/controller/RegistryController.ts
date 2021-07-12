import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Registry } from "../entity/Registry";

export class RegistryController {
  private registryRepository = getRepository(Registry);

  async all(request: Request, response: Response, next: NextFunction) {
    return (await this.registryRepository.find())
      .map((registry) => {
        return {
          id: registry.id,
          scaleName: registry.scaleName,
          weight: registry.weight.toString(),
          createdAt: registry.createdAt,
          userName: registry.userName,
        };
      })
      .reverse();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.registryRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    // console.log("====================================");
    delete request.body.id;
    // console.log(request.body);
    // console.log("====================================");
    try {
      await this.registryRepository.save(request.body);
      response.status(200).json({ message: "Peso capturado con exito" });
    } catch (error) {
      response.status(400).json({ errorMessage: "Error al capturar peso" });
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let registryToRemove = await this.registryRepository.findOne(
      request.params.id
    );
    await this.registryRepository.remove(registryToRemove);
  }
}
