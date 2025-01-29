import fs from "fs";
import path from "path";
import * as chalkUtils from "./chalkUtils.js";
import fromConsole from "./fromConsole.js";
import getCategories from "./getCategories.js";
import getAceConfigs from "./getAceConfigs.js";

let actionConfig = null;
let conditionConfig = null;
let expressionConfig = null;

function acesFromConfig() {
  const aces = {};

  getCategories(actionConfig, conditionConfig, expressionConfig).forEach(
    (category) => {
      aces[category] = {
        conditions: Object.keys(conditionConfig.config)
          .filter((key) => conditionConfig.categories[key] === category)
          .map((key) => {
            const ace = conditionConfig.config[key];
            const ret = {
              id: key,
              scriptName: key,
            };
            Object.keys(ace).forEach((key) => {
              switch (key) {
                case "category":
                case "forward":
                case "handler":
                case "autoScriptInterface":
                case "listName":
                case "displayText":
                case "description":
                case "params":
                  break;
                default:
                  ret[key] = ace[key];
              }
            });
            if (ace.params) {
              ret.params = ace.params.map((param) => {
                const ret = {};
                Object.keys(param).forEach((key) => {
                  switch (key) {
                    case "name":
                    case "desc":
                    case "items":
                      break;
                    default:
                      ret[key] = param[key];
                  }
                });
                if (param.items) {
                  ret.items = param.items.map((item) => Object.keys(item)[0]);
                }

                return ret;
              });
            }
            return ret;
          }),
        actions: Object.keys(actionConfig.config)
          .filter((key) => actionConfig.categories[key] === category)
          .map((key) => {
            const ace = actionConfig.config[key];
            const ret = {
              id: key,
              scriptName: key,
            };
            Object.keys(ace).forEach((key) => {
              switch (key) {
                case "category":
                case "forward":
                case "handler":
                case "autoScriptInterface":
                case "listName":
                case "displayText":
                case "description":
                case "params":
                  break;
                default:
                  ret[key] = ace[key];
              }
            });
            if (ace.params) {
              ret.params = ace.params.map((param) => {
                const ret = {};
                Object.keys(param).forEach((key) => {
                  switch (key) {
                    case "name":
                    case "desc":
                    case "items":
                      break;
                    default:
                      ret[key] = param[key];
                  }
                });
                if (param.items) {
                  ret.items = param.items.map((item) => Object.keys(item)[0]);
                }

                return ret;
              });
            }
            return ret;
          }),
        expressions: Object.keys(expressionConfig.config)
          .filter((key) => expressionConfig.categories[key] === category)
          .map((key) => {
            const ace = expressionConfig.config[key];
            const ret = {
              id: key,
              scriptName: key,
              expressionName: key,
            };
            Object.keys(ace).forEach((key) => {
              switch (key) {
                case "category":
                case "forward":
                case "handler":
                case "autoScriptInterface":
                case "listName":
                case "displayText":
                case "description":
                case "params":
                  break;
                default:
                  ret[key] = ace[key];
              }
            });
            if (ace.params) {
              ret.params = ace.params.map((param) => {
                const ret = {};
                Object.keys(param).forEach((key) => {
                  switch (key) {
                    case "name":
                    case "desc":
                    case "items":
                      break;
                    default:
                      ret[key] = param[key];
                  }
                });
                if (param.items) {
                  ret.items = param.items.map((item) => Object.keys(item)[0]);
                }

                return ret;
              });
            }
            return ret;
          }),
      };
    }
  );

  return aces;
}

export default async function generateAcesJSON() {
  let hadError = false;
  let hadOptionalError = false;
  let hadTip = false;

  chalkUtils.step("Generating aces.json");
  chalkUtils.subStep(`Getting ace configs from generated files`);

  await getAceConfigs()
    .then((modules) => {
      actionConfig = modules[0];
      conditionConfig = modules[1];
      expressionConfig = modules[2];
    })
    .catch((e) => {
      hadError = true;
      chalkUtils.failed("Failed to import generated config files");
    });
  if (hadError) {
    return { hadError, hadTip, hadOptionalError };
  }

  const aces = acesFromConfig();
  if (!fs.existsSync("../dist/export/")) {
    fs.mkdirSync("../dist/export/", { recursive: true });
  }
  fs.writeFileSync(
    path.resolve(`../dist/export/aces.json`),
    JSON.stringify(aces, null, 2)
  );

  chalkUtils.subSuccess(`aces.json`, "generated");
  chalkUtils.newLine();

  return { hadError, hadTip, hadOptionalError };
}

if (fromConsole(import.meta.url)) {
  const dependsOn = ["./generateAceFiles.js", "./validateAceConfigs.js"];
  build(dependsOn).then((hadError) => {
    if (hadError) return;
    generateAcesJSON();
  });
}
