import * as chalkUtils from "./chalkUtils.js";
import webpackConfig from "./webpack_buildstep.config.cjs";
import doWebpack from "./webpack.js";
import doVite from "./vite.js";
import viteConfig from "./vite_domside_config.js";
import fromConsole from "./fromConsole.js";
import { hasDomside } from "../config.caw.js";
import fs from "fs";

export default async function buildDomside() {
  if (!hasDomside) return false;
  if (!fs.existsSync("../src/domside/index.js")) {
    return false;
  }
  chalkUtils.step("Vite domside build");
  return await doVite(viteConfig);
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  buildDomside();
}
