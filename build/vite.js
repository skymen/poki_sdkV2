import { build } from "vite";
import * as chalkUtils from "./chalkUtils.js";

export default async function doVite(config) {
  let hadError = false;
  try {
    await build(config);
  } catch (error) {
    chalkUtils.errorList("Error(s) in Vite build", error.message.split(". "));
    hadError = true;
  }

  chalkUtils.newLine();
  if (hadError) {
    chalkUtils.error("Vite build failed");
  } else {
    chalkUtils.success("Vite build successful");
  }
  return hadError;
}
