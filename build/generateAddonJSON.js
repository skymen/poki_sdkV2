import fs from "fs";
import path from "path";
import * as chalkUtils from "./chalkUtils.js";
import config from "../template/addonConfig.js";
import fromConsole from "./fromConsole.js";

function getFileListFromConfig() {
  const files = [];
  if (config.hasDomside) {
    files.push("c3runtime/domside.js");
  }

  if (config.files.extensionScript && config.files.extensionScript.enabled) {
    const targets = config.files.extensionScript.targets || [];
    targets.forEach((target) => {
      const dllName = `${config.id}_${target.toLowerCase()}.ext.dll`;
      files.push(dllName);
    });
  }

  if (config.files.fileDependencies) {
    config.files.fileDependencies.forEach(function (file) {
      files.push(`c3runtime/${file.filename}`);
    });
  }

  if (config.info.defaultImageUrl) {
    files.push(`c3runtime/${config.info.defaultImageUrl}`);
  }

  return files;
}

function addonFromConfig() {
  return {
    "is-c3-addon": true,
    "sdk-version": 2,
    "min-construct-version": config.minConstructVersion,
    type: config.addonType,
    name: config.name,
    id: config.id,
    version: config.version,
    author: config.author,
    website: config.website,
    documentation: config.documentation,
    description: config.description,
    "editor-scripts": ["editor.js"],
    "file-list": [
      "c3runtime/main.js",
      "lang/en-US.json",
      "aces.json",
      "addon.json",
      config.icon ? config.icon : "icon.svg",
      "editor.js",
      ...getFileListFromConfig(config),
    ],
  };
}

export default function generateAddonJSON() {
  chalkUtils.step("Generating addon.json");
  const addon = addonFromConfig();
  if (!fs.existsSync("../dist/export")) {
    fs.mkdirSync("../dist/export", { recursive: true });
  }
  fs.writeFileSync(
    path.resolve("../dist/export/addon.json"),
    JSON.stringify(addon, null, 2),
    {
      recursive: true,
    }
  );
  chalkUtils.success("addon.json generated");
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  generateAddonJSON();
}
