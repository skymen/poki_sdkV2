import createPlugin from "../src/runtime/plugin.js";
import createType from "../src/runtime/type.js";
import enums from "../generated/enums.js";
import createInstance from "../src/runtime/instance.js";
import runtimeConfig from "../template/runtimeConfig.js";
import {
  exposed as exposedActs,
  unexposed as Acts,
} from "../generated/actions.js";
import {
  exposed as exposedCnds,
  unexposed as Cnds,
} from "../generated/conditions.js";
import {
  exposed as exposedExps,
  unexposed as Exps,
} from "../generated/expressions.js";
import AddonTypeMap from "./addonTypeMap.js";

const pluginBaseClasses = {
  object: globalThis.ISDKPluginBase,
  world: globalThis.ISDKPluginBase,
  dom: globalThis.ISDKDOMPluginBase,
};

const baseClass = {
  plugin: pluginBaseClasses[runtimeConfig.type],
  behavior: globalThis.ISDKBehaviorBase,
};

const typeClass = {
  plugin: globalThis.ISDKObjectTypeBase,
  behavior: globalThis.ISDKBehaviorTypeBase,
};

const pluginInstanceClass = {
  object: globalThis.ISDKInstanceBase,
  world: globalThis.ISDKWorldInstanceBase,
  dom: globalThis.ISDKDOMInstanceBase,
};

const instanceClass = {
  plugin: pluginInstanceClass[runtimeConfig.type],
  behavior: globalThis.ISDKBehaviorInstanceBase,
};

const Instance = createInstance(
  class extends instanceClass[runtimeConfig.addonType] {
    constructor() {
      if (runtimeConfig.hasDomside) {
        super({ domComponentId: runtimeConfig.id });
      } else {
        super();
      }
    }
  }
);
Object.assign(Instance.prototype, exposedActs);
Object.assign(Instance.prototype, exposedCnds);
Object.assign(Instance.prototype, exposedExps);

const Type = createType(typeClass[runtimeConfig.addonType]);
Object.assign(Type.prototype, enums);

globalThis.C3[AddonTypeMap[runtimeConfig.addonType]][runtimeConfig.id] = {
  Acts,
  Cnds,
  Exps,
  Instance,
  Type,
  Plugin: createPlugin(baseClass[runtimeConfig.addonType]),
};
