/**
 * This gets chart 100 from melon
 */

import { Router, Request, Response } from "express";
import crawl from "../../utils/crawl";

const route = Router();

export default (app: Router) => {
  app.use("/chart", route);

  route.get("/now", async (req: Request, res: Response) => {
    const chart = await crawl();
    const time = new Date().toLocaleString();
    res.status(200).json({ status: 200, name: "OK", time: time, chart });
  });
};
