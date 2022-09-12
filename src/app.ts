import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";
import * as helmet from "helmet";
import router from "./api";

const app = express();

/**
 * Set Default Header
 */
app.disable("x-powerd-by");
app.disable("etag");

/**
 * Graceful shutdown time
 */
const WAIT_BEFORE_SERVER_CLOSE =
  parseInt(process.env.WAIT_BEFORE_SERVER_CLOSE) || process.env.production
    ? 10
    : 3;

/**
 * Header, Cookie, Body, CORS
 */
app.use((req, res, next) => {
  res.setHeader("Content-Language", "ko-KR");

  next();
});

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  if (req.headers.origin || req.method == "OPTIONS") {
    res.set("Access-Control-Allow-Credentials", "true");
    res.set(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, PATCH, DELETE, OPTIONS"
    );
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.headers.origin) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }

    if (req.method === "OPTIONS") {
      res.send();
      return;
    }
  }
  next();
});

/**
 * Router
 */
const BASE_PATH = "/v1/api";
app.use(BASE_PATH, router());

const appServer = app.listen(process.env.production ? 80 : 3000, () => {
  console.log(
    `HTTP Server listening start on port ${process.env.production ? 80 : 3000}`
  );
  console.log(
    "----------------------------------------------------------------"
  );
});

/**
 * Graceful Shutdown
 */
const handle = (signal: string) => {
  console.log(`Shutdown Signal : ${signal}`);
  console.log(`Waiting for ${WAIT_BEFORE_SERVER_CLOSE} sec to close server`);

  setTimeout(() => {
    console.log("Close server");

    appServer.close(() => {
      process.exit(0);
    });
  }, WAIT_BEFORE_SERVER_CLOSE * 1000);
};

process.on("SIGINT", handle); // -1
process.on("SIGTERM", handle); // -15
