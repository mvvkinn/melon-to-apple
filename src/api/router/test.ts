import * as express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("OK");
});

export default router;
