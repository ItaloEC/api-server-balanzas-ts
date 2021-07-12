import { RegistryController } from "./controller/RegistryController";
import { ScaleController } from "./controller/ScaleController";
import { UserController } from "./controller/UserController";

export const Routes = [
  //user
  {
    method: "post",
    route: "/user/login",
    controller: UserController,
    action: "login",
  },
  {
    method: "get",
    route: "/user",
    controller: UserController,
    action: "all",
  },
  {
    method: "get",
    route: "/user/:id",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/user",
    controller: UserController,
    action: "save",
  },
  {
    method: "delete",
    route: "/user/:id",
    controller: UserController,
    action: "remove",
  },
  //scale
  {
    method: "get",
    route: "/scale",
    controller: ScaleController,
    action: "all",
  },
  {
    method: "get",
    route: "/scale/:id",
    controller: ScaleController,
    action: "one",
  },
  {
    method: "post",
    route: "/scale",
    controller: ScaleController,
    action: "save",
  },
  {
    method: "delete",
    route: "/scale/:id",
    controller: ScaleController,
    action: "remove",
  },
  //registry
  {
    method: "get",
    route: "/registry",
    controller: RegistryController,
    action: "all",
  },
  {
    method: "get",
    route: "/registry/:id",
    controller: RegistryController,
    action: "one",
  },
  {
    method: "post",
    route: "/registry",
    controller: RegistryController,
    action: "save",
  },
  {
    method: "delete",
    route: "/registry/:id",
    controller: RegistryController,
    action: "remove",
  },
];
