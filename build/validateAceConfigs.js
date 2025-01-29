import * as chalkUtils from "./chalkUtils.js";
import { actionSchema, conditionSchema, expressionSchema } from "./schemas.js";
import { config as actionConfigs } from "../generated/actionConfig.js";
import { all as actionsFunctions } from "../generated/actions.js";
import { config as conditionConfigs } from "../generated/conditionConfig.js";
import { all as conditionFunctions } from "../generated/conditions.js";
import { config as expressionConfigs } from "../generated/expressionConfig.js";
import { all as expressionFunctions } from "../generated/expressions.js";
import camelCasify from "./camelCasify.js";
import fromConsole from "./fromConsole.js";

let typeMap = {
  action: {
    schema: actionSchema,
    configs: actionConfigs,
    functions: actionsFunctions,
  },
  condition: {
    schema: conditionSchema,
    configs: conditionConfigs,
    functions: conditionFunctions,
  },
  expression: {
    schema: expressionSchema,
    configs: expressionConfigs,
    functions: expressionFunctions,
  },
};

let hadError = false;

function validateAceType(type) {
  if (!typeMap[type]) {
    chalkUtils.error(`Invalid ace type: ${chalkUtils._errorUnderline(type)}`);
    hadError = true;
    return;
  }

  let nameSet = new Set();
  let typeData = typeMap[type];

  for (let [name, config] of Object.entries(typeData.configs)) {
    chalkUtils.action(`Validating ${type}`, name);

    name = camelCasify(name);
    if (nameSet.has(name)) {
      chalkUtils.newLine();
      chalkUtils.error(
        `\nDuplicate ${type} name: ${chalkUtils._errorUnderline(name)}`
      );
      hadError = true;
    } else {
      nameSet.add(name);
    }
    const { error } = typeData.schema.validate(config, {
      abortEarly: false,
    });
    if (error) {
      chalkUtils.errorList(
        `Error(s) in ${type} ${chalkUtils._errorUnderline(name)}`,
        error.message.split(". ")
      );
      hadError = true;
    }
    let paramLength = 0;
    if (config.params) paramLength = config.params.length;
    if (paramLength !== typeData.functions[name].length) {
      chalkUtils.error(
        `Function length mismatch for ${type} ${chalkUtils._errorUnderline(
          name
        )}. Expected ${paramLength} but got ${typeData.functions[name].length}`
      );
      hadError = true;
    }
    if (!config.displayText) {
      continue;
    }
    //match stuff like {0}, {1}, {2} etc in displayText and it should be equal to the number of params
    let missingPlaceholders = [];
    for (let i = 0; i < paramLength; i++) {
      let shouldHave = `{${i}}`;
      if (!config.displayText.includes(shouldHave)) {
        missingPlaceholders.push(shouldHave);
      }
    }
    if (missingPlaceholders.length > 0) {
      chalkUtils.errorList(
        `Missing placeholders in ${type} ${chalkUtils._errorUnderline(name)}`,
        missingPlaceholders
      );
      hadError = true;
    }

    let match = config.displayText.match(/{\d+}/g);
    if (match) {
      // check if this matches any placeholder that is outside the bounds of the number of params
      let invalidPlaceholders = [];
      for (let placeholder of match) {
        let index = parseInt(placeholder.slice(1, -1));
        if (index >= paramLength || index < 0) {
          invalidPlaceholders.push(placeholder);
        }
      }
      if (invalidPlaceholders.length > 0) {
        chalkUtils.errorList(
          `Invalid placeholders in ${type} ${chalkUtils._errorUnderline(name)}`,
          invalidPlaceholders
        );
        hadError = true;
      }
    }
  }
}

export default function validateAce() {
  hadError = false;
  chalkUtils.step("Validating ACE configs");
  validateAceType("action");
  validateAceType("condition");
  validateAceType("expression");

  if (hadError) {
    chalkUtils.failed("Some ACE configs are invalid.");
  } else {
    chalkUtils.success("All ACE configs are valid!");
  }
  return hadError;
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  validateAce();
}
