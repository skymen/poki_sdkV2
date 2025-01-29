import * as chalkUtils from "./chalkUtils.js";
import removeDir from "./removeDir.js";
import fromConsole from "./fromConsole.js";

export default function cleanup() {
  let hadError = false;

  chalkUtils.step("Cleaning up");

  removeDir("../dist/export");
  removeDir("../dist/exportStep");
  removeDir("../generated");

  chalkUtils.success("Cleaned up");

  return hadError;
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  cleanup();
}
