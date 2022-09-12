import { Router } from "express";

const router = Router();

export default (app: Router) => {
  app.get("/test", (req, res) => {
    res.send("OK");
  });
};
