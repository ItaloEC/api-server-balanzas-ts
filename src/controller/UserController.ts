import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOne(request.params.id);
    await this.userRepository.remove(userToRemove);
  }

  async login(request: Request, response: Response, next: NextFunction) {
    let user = await this.userRepository.findOne({
      where: {
        email: request.body.email,
        password: request.body.password,
      },
    });
    if (user) {
      response.status(200).json({ userName: user.name });
    } else {
      response.status(400).json({ errorMessage: "Usuario no ubicado." });
    }
  }
}
