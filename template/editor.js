import createInstanceClass from "../src/editor/instance.js";
import createPluginClass from "../template/plugin.js";
import createTypeClass from "../src/editor/type.js";
import ADDON_INFO from "../template/editorConfig.js";
const SDK = self.SDK;

const AddonTypeMap = {
  plugin: "Plugins",
  behavior: "Behaviors",
};

const SDKType = SDK[AddonTypeMap[ADDON_INFO.addonType]];

const baseClass = {
  plugin: SDK.IPluginBase,
  behavior: SDK.IBehaviorBase,
};

const typeClass = {
  plugin: SDK.ITypeBase,
  behavior: SDK.IBehaviorTypeBase,
};

const pluginInstanceParentClass = {
  object: SDK.IInstanceBase,
  world: SDK.IWorldInstanceBase,
  dom: SDK.IWorldInstanceBase,
};

const instanceClass = {
  plugin: pluginInstanceParentClass[ADDON_INFO.type],
  behavior: SDK.IBehaviorInstanceBase,
};

SDKType[ADDON_INFO.id] = createPluginClass(
  ADDON_INFO,
  baseClass[ADDON_INFO.addonType]
);
const AddonClass = SDKType[ADDON_INFO.id];
AddonClass.Register(ADDON_INFO.id, AddonClass);

AddonClass.Type = createTypeClass(typeClass[ADDON_INFO.addonType]);

AddonClass.Instance = createInstanceClass(instanceClass[ADDON_INFO.addonType]);
console.log(AddonClass);
