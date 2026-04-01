import fs from "fs";
import path from "path";
import * as chalkUtils from "./chalkUtils.js";
import { files, hasDomside, id } from "../config.caw.js";
import fromConsole from "./fromConsole.js";
import { failOnUnusedFiles } from "../buildconfig.js";

export default function processDependencies() {
  let hadError = false;
  let hadOptionalError = false;
  let hadTip = false;

  chalkUtils.step("Processing dependencies");

  let filesToCopy = [];
  if (files.fileDependencies)
    filesToCopy.push(...files.fileDependencies.map((file) => file.filename));

  filesToCopy.forEach((file) => {
    const src = path.resolve(path.join("../src/files", file));
    const dest = path.resolve(path.join("../dist/export/c3runtime", file));

    if (!fs.existsSync(src)) {
      chalkUtils.error(`File not found: ${chalkUtils._errorUnderline(src)}`);
      hadError = true;
    } else {
      fs.copyFileSync(src, dest);
    }
  });

  if (hasDomside) {
    const src = path.resolve("../generated/domside.js");
    const dest = path.resolve("../dist/export/c3runtime/domside.js");

    if (!fs.existsSync(src)) {
      chalkUtils.error(`File not found: ${chalkUtils._errorUnderline(src)}`);
      hadError = true;
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  if (files.extensionScript && files.extensionScript.enabled) {
    const targets = files.extensionScript.targets || [];
    targets.forEach((target) => {
      const dllName = `${
        files.extensionScript.name
      }_${target.toLowerCase()}.ext.dll`;
      const src = path.resolve(`../src_cpp/Build/${dllName}`);
      const dest = path.resolve(
        `../dist/export/${id}_${target.toLowerCase()}.ext.dll`
      );

      if (!fs.existsSync(src)) {
        chalkUtils.error(`File not found: ${chalkUtils._errorUnderline(src)}`);
        hadError = true;
      } else {
        fs.copyFileSync(src, dest);
      }
    });
  }

  // check if files in files folder exist but aren't in the config
  const filesDir = "../src/files";
  if (fs.existsSync(filesDir)) {
    fs.readdirSync(filesDir).forEach((file) => {
      if (filesToCopy.includes(file)) return;
      chalkUtils.error(
        `File not in config: ${chalkUtils._errorUnderline(file)}`
      );
      hadOptionalError = true;
    });
  }

  if (failOnUnusedFiles && hadOptionalError) {
    hadError = true;
    hadOptionalError = false;
    hadTip = chalkUtils._tip(
      `${chalkUtils.tipHighlight(
        "./processDependencies.js"
      )}: To prevent the build from failing due to unused files, set ${chalkUtils.tipHighlight(
        "failOnUnusedFiles"
      )} in the build config.`
    );
  }

  return { hadError, hadTip, hadOptionalError };
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  processDependencies();
}
