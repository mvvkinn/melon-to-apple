import { Router } from "express";
import chart from "./router/chart";
import test from "./router/test";

export default () => {
  const app = Router();
  chart(app);
  test(app);

  return app;
};
