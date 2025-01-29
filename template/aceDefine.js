import fs from "fs";
import path from "path";
import * as chalkUtils from "../build/chalkUtils.js";

const defineAce = (
  type,
  category,
  name,
  config,
  actionFunction,
  expose = true
) => {
  chalkUtils.action(`Generating ${type}`, name);

  const directory = `../generated/aces/${category}`;
  const fileName = `${type}.${name}.js`;

  // Ensure directory exists
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Build file content
  const fileContent = `export const config = ${JSON.stringify(config, null, 2)};

export const expose = ${expose ? "true" : "false"};

export default ${actionFunction.toString()}`;

  // Write file
  fs.writeFileSync(path.join(directory, fileName), fileContent);
};

const action = (category, name, config, actionFunction, expose = true) => {
  defineAce("action", category, name, config, actionFunction, expose);
};

const act = action;
const a = action;

const condition = (category, name, config, actionFunction, expose = true) => {
  defineAce("condition", category, name, config, actionFunction, expose);
};

const cnd = condition;
const c = condition;

const expression = (category, name, config, actionFunction, expose = true) => {
  defineAce("expression", category, name, config, actionFunction, expose);
};

const exp = expression;
const e = expression;

export { a, act, action, c, cnd, condition, e, exp, expression };
