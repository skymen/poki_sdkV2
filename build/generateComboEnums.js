import fs from "fs";
import path from "path";
import * as chalkUtils from "./chalkUtils.js";
import fromConsole from "./fromConsole.js";
import getAceConfigs from "./getAceConfigs.js";
import getAceFunctions from "./getAceFunctions.js";
import camelCasify from "./camelCasify.js";

let actionConfig = null;
let actionFunctions = null;
let conditionConfig = null;
let conditionFunctions = null;
let expressionConfig = null;
let expressionFunctions = null;

function generateEnumFor(aceConfig, aceFunctions, paramsToGenerateEnumsFor) {
  for (let [name, config] of Object.entries(aceConfig.config)) {
    let func = aceFunctions.exposed[name];
    if (!func || !config.params) {
      continue;
    }
    for (let param of config.params) {
      if (param.type === "combo") {
        paramsToGenerateEnumsFor.push({
          name,
          param: { id: camelCasify(param.id), items: param.items },
        });
      }
    }
  }
}

export default async function generateEnums() {
  let hadError = false;
  let hadOptionalError = false;
  let hadTip = false;

  chalkUtils.step("Generating enums");
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

  await getAceFunctions()
    .then((modules) => {
      actionFunctions = modules[0];
      conditionFunctions = modules[1];
      expressionFunctions = modules[2];
    })
    .catch((e) => {
      hadError = true;
      chalkUtils.failed("Failed to import generated function files");
    });
  if (hadError) {
    return { hadError, hadTip, hadOptionalError };
  }

  let paramsToGenerateEnumsFor = [];

  generateEnumFor(actionConfig, actionFunctions, paramsToGenerateEnumsFor);
  generateEnumFor(
    conditionConfig,
    conditionFunctions,
    paramsToGenerateEnumsFor
  );
  generateEnumFor(
    expressionConfig,
    expressionFunctions,
    paramsToGenerateEnumsFor
  );

  let enums = {};

  for (let { name, param } of paramsToGenerateEnumsFor) {
    chalkUtils.action(`Generating enum`, param.id, `for ${name}`);
    enums[name] = enums[name] || {};
    enums[name][param.id] = {};
    param.items.forEach((item, i) => {
      let id = camelCasify(Object.keys(item)[0]);
      let value = i;
      enums[name][param.id][id] = value;
    });
  }

  let enumsPath = path.resolve("../generated/enums.js");
  let enumsContent = `export default ${JSON.stringify(enums, null, 2)};`;
  fs.writeFileSync(enumsPath, enumsContent);

  return { hadError, hadTip, hadOptionalError };
}

if (fromConsole(import.meta.url)) {
  const dependsOn = ["./generateAceFiles.js", "./validateAceConfigs.js"];
  build(dependsOn).then((hadError) => {
    if (hadError) return;
    generateAcesJSON();
  });
}
