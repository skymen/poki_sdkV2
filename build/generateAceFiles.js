import fs from "fs";
import path from "path";
import * as chalkUtils from "./chalkUtils.js";
import camelCasify from "./camelCasify.js";
import fromConsole from "./fromConsole.js";

let hadError = false;

const shorthandMap = {
  actions: ["a", "action", "act"],
  conditions: ["c", "condition", "cnd"],
  expressions: ["e", "expression", "exp"],
};

function processNewACEFileFormatInCategory(
  basePath,
  category,
  type,
  collection,
  nameSet
) {
  fs.readdirSync(basePath).forEach((file) => {
    if (!file.endsWith(".js")) return;
    if (!shorthandMap[type].includes(file.split(".")[0])) return;
    const name = camelCasify(file.split(".")[1]);
    chalkUtils.action("  Processing", `${category}/${type}/${name}`);
    if (nameSet.has(name)) {
      chalkUtils.error(
        `Duplicate ${type} name: ${chalkUtils._errorUnderline(name)}`
      );
      hadError = true;
    }
    nameSet.add(name);
    collection.push({
      category,
      name,
      filepath: path.join(basePath, file).replace(/\\/g, "/"),
    });
  });
}

function processACEInCategory(basePath, category, type, collection, nameSet) {
  const typePath = path.join(basePath, type);
  if (!fs.existsSync(typePath)) return;
  fs.readdirSync(typePath).forEach((file) => {
    if (!file.endsWith(".js")) return;
    const name = camelCasify(file.slice(0, -3));
    chalkUtils.action("  Processing", `${category}/${type}/${name}`);
    if (nameSet.has(name)) {
      chalkUtils.error(
        `Duplicate ${type} name: ${chalkUtils._errorUnderline(name)}`
      );
      hadError = true;
    }
    nameSet.add(name);
    collection.push({
      category,
      name,
      filepath: path.join(typePath, file).replace(/\\/g, "/"),
    });
  });
}

async function getExposeValue(collection, exposedNameSet) {
  for (const ace of collection) {
    let { filepath } = ace;
    // use the correct slash for imports
    const aceModule = await import(filepath);
    if (aceModule.expose === undefined) {
      ace.expose = true;
    } else {
      ace.expose = !!aceModule.expose;
    }

    if (ace.expose) {
      if (exposedNameSet.has(ace.name)) {
        chalkUtils.error(
          `Duplicate exposed name: ${chalkUtils._errorUnderline(ace.name)}`
        );
        hadError = true;
      }
      exposedNameSet.add(ace.name);
    }
  }
}

function generateJS(type, collection) {
  let jsCode = "import forward from './forward.js';\n";
  for (const ace of collection) {
    const { name, filepath } = ace;
    jsCode += `import ${name} from "${filepath}";\n`;
  }

  jsCode += `\nexport const exposed = {`;

  for (const ace of collection) {
    const { name, expose } = ace;
    if (!expose) continue;
    jsCode += `${name},`;
  }

  jsCode += `};\n\nexport const unexposed = {`;

  for (const ace of collection) {
    const { name, expose } = ace;
    if (!expose) jsCode += `${name},`;
    else jsCode += `${name}: forward("${name}"),`;
  }

  jsCode += `};\n\nexport const all = {`;

  for (const ace of collection) {
    const { name } = ace;
    jsCode += `${name},`;
  }

  jsCode += `};`;
  return jsCode;
}

function generateConfigJs(type, collection) {
  let jsCode = "";
  for (const ace of collection) {
    const { name, filepath } = ace;
    jsCode += `import { config as ${name}} from "${filepath}";\n`;
  }

  jsCode += "\nexport const config = {";
  for (const ace of collection) {
    const { name } = ace;
    jsCode += `${name},`;
  }
  jsCode += "};";

  jsCode += "\nexport const categories = {";
  for (const ace of collection) {
    const { category, name } = ace;
    jsCode += `${name}: "${category}",`;
  }
  jsCode += "};";
  return jsCode;
}

async function generateAndWrite(
  type,
  collection,
  jsPath,
  configPath,
  exposedNameSet
) {
  chalkUtils.action("  Writing", type, "files");
  await getExposeValue(collection, exposedNameSet);
  fs.writeFileSync(jsPath, generateJS(type, collection));
  fs.writeFileSync(configPath, generateConfigJs(type, collection));
}

export default async function generateAceFiles() {
  chalkUtils.step("Generating ACE files");
  hadError = false;
  const acesDirs = ["../src/aces", "../generated/aces"];
  const generatedDir = "../generated";
  const actions = [];
  const conditions = [];
  const expressions = [];

  chalkUtils.subStep("Processing ACEs");

  const actSet = new Set();
  const cndSet = new Set();
  const expSet = new Set();
  for (const acesDir of acesDirs) {
    if (!fs.existsSync(acesDir)) continue;
    fs.readdirSync(acesDir).forEach((category) => {
      const catPath = path.join(acesDir, category);
      if (!fs.statSync(catPath).isDirectory()) return;
      processACEInCategory(catPath, category, "actions", actions, actSet);
      processNewACEFileFormatInCategory(
        catPath,
        category,
        "actions",
        actions,
        actSet
      );
      processACEInCategory(catPath, category, "conditions", conditions, cndSet);
      processNewACEFileFormatInCategory(
        catPath,
        category,
        "conditions",
        conditions,
        cndSet
      );
      processACEInCategory(
        catPath,
        category,
        "expressions",
        expressions,
        expSet
      );
      processNewACEFileFormatInCategory(
        catPath,
        category,
        "expressions",
        expressions,
        expSet
      );
    });
  }

  chalkUtils.newLine();
  chalkUtils.success("Done processing");
  chalkUtils.newLine();

  chalkUtils.subStep("Writing files");

  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  const actionsJsPath = path.join(generatedDir, "actions.js");
  const actionConfigJsPath = path.join(generatedDir, "actionConfig.js");
  const conditionsJsPath = path.join(generatedDir, "conditions.js");
  const conditionConfigJsPath = path.join(generatedDir, "conditionConfig.js");
  const expressionsJsPath = path.join(generatedDir, "expressions.js");
  const expressionConfigJsPath = path.join(generatedDir, "expressionConfig.js");
  const forwardJsPath = path.join(generatedDir, "forward.js");

  chalkUtils.action("  Writing", "forward.js");
  fs.writeFileSync(
    forwardJsPath,
    `export default function(name) {
  return function (...args) {
    return this[name](...args);
  };\n}`
  );
  const exposedNameSet = new Set();
  await Promise.all([
    generateAndWrite(
      "actions",
      actions,
      actionsJsPath,
      actionConfigJsPath,
      exposedNameSet
    ),
    generateAndWrite(
      "conditions",
      conditions,
      conditionsJsPath,
      conditionConfigJsPath,
      exposedNameSet
    ),
    generateAndWrite(
      "expressions",
      expressions,
      expressionsJsPath,
      expressionConfigJsPath,
      exposedNameSet
    ),
  ]);

  chalkUtils.newLine();
  if (hadError) {
    chalkUtils.error("Errors occurred while processing aces");
  } else {
    chalkUtils.success("Done writing addon files");
  }
  return hadError;
}

if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  generateAceFiles();
}
