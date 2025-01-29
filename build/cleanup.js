import * as chalkUtils from "./chalkUtils.js";
import removeDir from "./removeDir.js";
import { cleanup as config } from "../buildconfig.js";
import fromConsole from "./fromConsole.js";

export default function cleanup() {
  let hadError = false;
  let hadTip = false;

  chalkUtils.step("Cleaning up");

  if (!config.keepExport) removeDir("../dist/export");
  if (!config.keepExportStep) removeDir("../dist/exportStep");
  if (!config.keepGenerated) removeDir("../generated");

  chalkUtils.success("Cleaned up");

  if (
    !config.keepExport &&
    !config.keepExportStep &&
    !config.keepGenerated &&
    !config.disableTip
  ) {
    hadTip = chalkUtils._tip(
      `${chalkUtils.tipHighlight(
        "./cleanup.js"
      )}: To keep intermediate build step files, change ${chalkUtils.tipHighlight(
        "cleanup"
      )} settings in the build config.`
    );
  }

  return { hadError, hadTip };
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  cleanup();
}
