import fs from "fs";
import path from "path";
import * as chalkUtils from "./chalkUtils.js";
import config from "../template/addonConfig.js";
import { properties, aceCategories } from "../config.caw.js";
import { failOnMalformedExtraLang } from "../buildconfig.js";
import fromConsole from "./fromConsole.js";
import build from "./build.js";
import getCategories from "./getCategories.js";
import getAceConfigs from "./getAceConfigs.js";

const defaultLanguage = "en-US";

let actionConfig = null;
let conditionConfig = null;
let expressionConfig = null;

function formatCategories() {
  let categoriesObj = {};
  getCategories(actionConfig, conditionConfig, expressionConfig).forEach(
    (category) => {
      categoriesObj[category] = aceCategories[category] ?? category;
    }
  );
  return categoriesObj;
}

function langFromConfig() {
  let id = config.id.toLowerCase();
  const lang = {
    languageTag: defaultLanguage,
    fileDescription: `Strings for ${id}.`,
    text: {},
  };

  let root;
  if (config.addonType === "plugin") {
    lang.text.plugins = {};
    lang.text.plugins[id] = {};
    root = lang.text.plugins[id];
  } else if (config.addonType === "behavior") {
    lang.text.behaviors = {};
    lang.text.behaviors[id] = {};
    root = lang.text.behaviors[id];
  } else if (config.addonType === "effect") {
    lang.text.effects = {};
    lang.text.effects[id] = {};
    root = lang.text.effects[id];
  } else {
    throw new Error("Invalid addon type");
  }
  root.name = config.name;
  root.description = config.description;
  root["help-url"] = config.documentation;
  root.aceCategories = formatCategories();
  root.properties = {};
  properties.forEach((property) => {
    root.properties[property.id] = {
      name: property.name,
      desc: property.desc,
    };
    if (property.type === "combo") {
      root.properties[property.id].items = {};
      property.options.items.forEach((item) => {
        const key = Object.keys(item)[0];
        root.properties[property.id].items[key] = item[key];
      });
    } else if (property.type === "link") {
      root.properties[property.id]["link-text"] = property.linkText;
    }
  });

  root.actions = {};
  Object.keys(actionConfig.config).forEach((key) => {
    const action = actionConfig.config[key];
    const id = action.id ? action.id : key;
    root.actions[id] = {
      "list-name": action.listName,
      "display-text": action.displayText,
      description: action.description,
      params: {},
    };
    action.params = action.params || [];
    action.params.forEach((param) => {
      root.actions[id].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.actions[id].params[param.id].items = {};
        param.items.forEach((item) => {
          const itemkey = Object.keys(item)[0];
          root.actions[id].params[param.id].items[itemkey] = item[itemkey];
        });
      }
    });
  });

  root.conditions = {};
  Object.keys(conditionConfig.config).forEach((key) => {
    const condition = conditionConfig.config[key];
    const id = condition.id ? condition.id : key;
    root.conditions[id] = {
      "list-name": condition.listName,
      "display-text": condition.displayText,
      description: condition.description,
      params: {},
    };
    condition.params = condition.params || [];
    condition.params.forEach((param) => {
      root.conditions[id].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.conditions[id].params[param.id].items = {};
        param.items.forEach((item) => {
          const itemkey = Object.keys(item)[0];
          root.conditions[id].params[param.id].items[itemkey] = item[itemkey];
        });
      }
    });
  });

  root.expressions = {};
  Object.keys(expressionConfig.config).forEach((key) => {
    const expression = expressionConfig.config[key];
    const id = expression.id ? expression.id : key;
    root.expressions[id] = {
      "translated-name": key,
      description: expression.description,
      params: {},
    };
    expression.params = expression.params || [];
    expression.params.forEach((param) => {
      root.expressions[id].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.expressions[id].params[param.id].items = {};
        param.items.forEach((item) => {
          const itemkey = Object.keys(item)[0];
          root.expressions[key].params[param.id].items[itemkey] = item[itemkey];
        });
      }
    });
  });

  return lang;
}

function compareLangs(lang, base) {
  let missing = [];
  let extra = [];
  for (let key in base) {
    if (lang[key] === undefined) {
      missing.push(key);
    } else if (typeof base[key] === "object") {
      const { missing: subMissing, extra: subExtra } = compareLangs(
        lang[key],
        base[key]
      );
      missing = missing.concat(subMissing.map((subKey) => `${key}.${subKey}`));
      extra = extra.concat(subExtra.map((subKey) => `${key}.${subKey}`));
    }
  }
  for (let key in lang) {
    if (base[key] === undefined) {
      extra.push(key);
    }
  }
  return { missing, extra };
}

export default async function generateLangJSON() {
  let hadError = false;
  let hadOptionalError = false;
  let hadTip = false;

  chalkUtils.step("Generating Language files");
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
  chalkUtils.subStep(`Generating default lang: ${defaultLanguage}.json`);
  const lang = langFromConfig();
  if (!fs.existsSync("../dist/export/lang")) {
    fs.mkdirSync("../dist/export/lang", { recursive: true });
  }
  fs.writeFileSync(
    path.resolve(`../dist/export/lang/${defaultLanguage}.json`),
    JSON.stringify(lang, null, 2)
  );
  fs.writeFileSync(
    path.resolve(`../template/${defaultLanguage}.json`),
    JSON.stringify(lang, null, 2)
  );
  chalkUtils.subSuccess(`${defaultLanguage}.json`, "generated");
  chalkUtils.newLine();

  // check if other languages exist in src/extraLangs and copy them to dist/export/lang
  const extraLangsDir = "../src/extraLangs";
  if (fs.existsSync(extraLangsDir)) {
    chalkUtils.subStep("Processing extra language(s)");

    fs.readdirSync(extraLangsDir).forEach((file) => {
      // read json file and compare with default lang
      const lang = JSON.parse(
        fs.readFileSync(path.resolve(`${extraLangsDir}/${file}`))
      );
      const { missing, extra } = compareLangs(lang, langFromConfig());
      if (missing.length > 0 || extra.length > 0) {
        chalkUtils.failed(`${file} is malformed`);
        hadOptionalError = true;
      }
      if (missing.length > 0) {
        chalkUtils.errorList("missing keys", missing);
      }

      if (extra.length > 0) {
        chalkUtils.errorList("extra keys", extra);
      }

      if (missing.length === 0 && extra.length === 0) {
        chalkUtils.subSuccess(file, "OK");

        fs.copyFileSync(
          path.resolve(`${extraLangsDir}/${file}`),
          path.resolve(`../dist/export/lang/${file}`)
        );
      } else {
        chalkUtils.newLine();
      }

      chalkUtils.newLine();
    });

    if (failOnMalformedExtraLang && hadOptionalError) {
      hadError = true;
      hadOptionalError = false;
      hadTip = chalkUtils._tip(
        `${chalkUtils.tipHighlight(
          "./generateLangJSON.js"
        )}: To prevent the build from failing due to malformed extra language files, set ${chalkUtils.tipHighlight(
          "failOnMalformedExtraLang"
        )} in the build config.`
      );
    }

    if (hadError) {
      chalkUtils.failed("Extra language(s) malformed");
    } else {
      chalkUtils.success("Extra language(s) copied");
    }
  }

  return { hadError, hadTip, hadOptionalError };
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  const dependsOn = ["./generateAceFiles.js", "./validateAceConfigs.js"];
  build(dependsOn).then((hadError) => {
    if (hadError) return;
    generateLangJSON();
  });
}
