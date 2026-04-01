import buildWrapperExtension from "./generateWrapperExtension.js";
import config from "../template/addonConfig.js";
import fromConsole from "./fromConsole.js";

export default async function buildWrapperExtensionDev() {
  if (
    !config.files.extensionScript?.enabled ||
    !config.files.extensionScript?.watch
  ) {
    return {
      hadError: false,
      hadTip: false,
      hadOptionalError: false,
    };
  }
  return await buildWrapperExtension();
}

if (fromConsole(import.meta.url)) {
  const dependsOn = [];
  build(dependsOn).then((hadError) => {
    if (hadError) return;
    buildWrapperExtensionDev();
  });
}
