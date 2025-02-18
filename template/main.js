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

const pluginBaseClasses = new Map([
  ["object", globalThis.ISDKPluginBase],
  ["world", globalThis.ISDKPluginBase],
  ["dom", globalThis.ISDKDOMPluginBase],
]);

const baseClass = new Map([
  ["plugin", pluginBaseClasses.get(runtimeConfig.type)],
  ["behavior", globalThis.ISDKBehaviorBase],
]);

const typeClass = new Map([
  ["plugin", globalThis.ISDKObjectTypeBase],
  ["behavior", globalThis.ISDKBehaviorTypeBase],
]);

const pluginInstanceClass = new Map([
  ["object", globalThis.ISDKInstanceBase],
  ["world", globalThis.ISDKWorldInstanceBase],
  ["dom", globalThis.ISDKDOMInstanceBase],
]);

const instanceClass = new Map([
  ["plugin", pluginInstanceClass.get(runtimeConfig.type)],
  ["behavior", globalThis.ISDKBehaviorInstanceBase],
]);

const Instance = createInstance(
  class extends instanceClass.get(runtimeConfig.addonType) {
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

const Type = createType(typeClass.get(runtimeConfig.addonType));
Object.assign(Type.prototype, enums);

const C3Space = new Map([
  ["plugin", globalThis.C3.Plugins],
  ["behavior", globalThis.C3.Behaviors],
]);

C3Space.get(runtimeConfig.addonType)[runtimeConfig.id] = {
  Acts,
  Cnds,
  Exps,
  Instance,
  Type,
  Plugin: createPlugin(baseClass.get(runtimeConfig.addonType)),
};
