import express from "express";
import { exec } from "child_process";
import chokidar from "chokidar";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fromConsole from "./fromConsole.js";
import * as chalkUtils from "./chalkUtils.js";
import { basePort } from "../devConfig.js";
import cleanup from "./cleanup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEV_LOCK_FILE = path.resolve(__dirname, "../.dev-server-running");

let port = basePort;
const localHostURL = () => `http://localhost:${port}/addon.json`;
let buildRunning = false;

export default async function dev() {
  // Create lock file to indicate dev server is running
  fs.writeFileSync(DEV_LOCK_FILE, String(process.pid));
  chalkUtils.info("Dev server lock file created");

  // Clean up lock file on exit
  const cleanupLockFile = () => {
    if (fs.existsSync(DEV_LOCK_FILE)) {
      fs.unlinkSync(DEV_LOCK_FILE);
      chalkUtils.info("Dev server lock file removed");
    }
    cleanup();
  };

  process.on("SIGINT", () => {
    cleanupLockFile();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    cleanupLockFile();
    process.exit(0);
  });

  process.on("exit", cleanupLockFile);
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
    childProcess.stderr.pipe(process.stderr);
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
