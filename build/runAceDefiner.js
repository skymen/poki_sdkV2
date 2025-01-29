import fs from "fs";
import * as chalkUtils from "./chalkUtils.js";
import fromConsole from "./fromConsole.js";

export default async function runAceDefiner() {
  let hadError = false;

  const aceDefinerPath = "../src/aces.js";

  if (!fs.existsSync(aceDefinerPath)) {
    return hadError;
  }

  chalkUtils.step("Running ACE definer");

  await import(aceDefinerPath).catch((e) => {
    hadError = true;
    chalkUtils.failed("Failed to import ACE definer");
  });

  return hadError;
}

if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  generateAceFiles();
}
