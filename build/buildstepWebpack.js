import * as chalkUtils from "./chalkUtils.js";
import webpackConfig from "./webpack_buildstep.config.cjs";
import doWebpack from "./webpack.js";
import doVite from "./vite.js";
import viteConfig from "./vite_buildstep_config.js";
import fromConsole from "./fromConsole.js";

export default async function buildstepWebpack() {
  chalkUtils.step("Vite intermediate build");
  // return await doWebpack(webpackConfig);
  return await doVite(viteConfig);
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  buildstepWebpack();
}
