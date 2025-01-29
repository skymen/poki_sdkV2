import express from "express";
import { exec } from "child_process";
import chokidar from "chokidar";
import cors from "cors";
import fromConsole from "./fromConsole.js";
import * as chalkUtils from "./chalkUtils.js";
import { basePort } from "../devConfig.js";

let port = basePort;
const localHostURL = () => `http://localhost:${port}/addon.json`;
let buildRunning = false;

export default async function dev() {
  // Execute build command
  const runBuild = () => {
    if (buildRunning) return;
    buildRunning = true;
    process.env.FORCE_COLOR = "1";
    let childProcess = exec("node doDev.js", (error, stdout, stderr) => {
      buildRunning = false;
      if (error) {
        return;
      }
      chalkUtils.info(
        `Addon served at:\n${chalkUtils.infoHighlight(localHostURL())}`
      );
    });
    childProcess.stdout.pipe(process.stdout);
  };

  // Run initial build
  runBuild();

  // Watch for file changes in the src directory
  // log pwd
  console.log(process.cwd());
  const watcher = chokidar.watch(["../src", "../config.caw.js"], {
    ignored: [/^([.][^.\/\\])|([\/\\]+[.][^.])/],
    persistent: true,
  });

  watcher.on("change", (path) => {
    chalkUtils.info(`File ${path} has been changed. Re-running build...`);
    runBuild();
  });

  const app = express();
  app.use(cors());
  app.use(express.static("../dist/export"));

  function tryListen() {
    app.listen(port, () => {
      chalkUtils.info("Server is running at http://localhost:" + port);
    });
  }

  process.on("uncaughtException", function (err) {
    if (err.code === "EADDRINUSE") {
      chalkUtils.info(`Port ${port} is already in use. Trying another port...`);
      port++;
      tryListen();
    } else {
      chalkUtils.error(err);
      process.exit(1);
    }
  });

  tryListen();
}

if (fromConsole(import.meta.url)) {
  dev();
}
