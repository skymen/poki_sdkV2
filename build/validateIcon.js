import fs from "fs";
import path from "path";
import * as chalkUtils from "./chalkUtils.js";
import { info } from "../config.caw.js";
import fromConsole from "./fromConsole.js";

export default function validateIcon() {
  let hadError = false;
  chalkUtils.step("Validating icon");
  let icon = info.icon || "icon.svg";
  // check icon exists, and if it does move to dist/export
  let iconPath = path.resolve(path.join("../src", icon));
  let distPath = path.resolve(path.join("../dist/export", icon));

  if (!fs.existsSync(iconPath)) {
    chalkUtils.error(
      `Icon file not found: ${chalkUtils._errorUnderline(icon)}`
    );
    hadError = true;
  } else {
    fs.copyFileSync(iconPath, distPath);
    chalkUtils.success(`Icon file is valid!`);
  }
  return hadError;
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  validateIcon();
}
