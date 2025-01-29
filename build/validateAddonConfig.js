import * as chalkUtils from "./chalkUtils.js";
import { configSchema } from "./schemas.js";
import * as addonConfig from "../config.caw.js";
import fromConsole from "./fromConsole.js";

export default function validateAddonConfig() {
  let hadError = false;
  chalkUtils.step("Validating addon config");
  const { error } = configSchema.validate(addonConfig, {
    abortEarly: false,
  });

  if (error) {
    chalkUtils.errorList("Error(s) in addon config", error.message.split(". "));
    hadError = true;
  }

  if (hadError) {
    chalkUtils.failed("Addon config is invalid.");
  } else {
    chalkUtils.success("Addon config is valid!");
  }
  return hadError;
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  validateAddonConfig();
}
