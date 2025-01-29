import fs from "fs";
import AdmZip from "adm-zip";
import * as chalkUtils from "./chalkUtils.js";
import { id, version } from "../config.caw.js";
import fromConsole from "./fromConsole.js";

export default function packageAddon() {
  let hadError = false;

  chalkUtils.step("Packaging addon");

  // zip the content of the export folder and name it with the plugin id and version and use .c3addon as extension
  const zip = new AdmZip();
  zip.addLocalFolder("../dist/export/c3runtime", "c3runtime");
  zip.addLocalFolder("../dist/export/lang", "lang");

  // for each remaining file in the root export folder
  fs.readdirSync("../dist/export").forEach((file) => {
    // if the file is not the c3runtime or lang folder
    if (file !== "c3runtime" && file !== "lang") {
      // add it to the zip
      zip.addLocalFile(`../dist/export/${file}`, "");
    }
  });
  zip.writeZip(`../dist/${id}-${version}.c3addon`);

  chalkUtils.action(" ", `${id}-${version}.c3addon`, "created");
  chalkUtils.newLine();
  chalkUtils.success(`Addon packaged`);
  return hadError;
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  packageAddon();
}
