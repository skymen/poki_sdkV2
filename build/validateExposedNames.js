import * as chalkUtils from "./chalkUtils.js";
import { exposed as exposedActs } from "../generated/actions.js";
import { exposed as exposedCnds } from "../generated/conditions.js";
import { exposed as exposedExps } from "../generated/expressions.js";
import { addonType, type } from "../config.caw.js";
import fromConsole from "./fromConsole.js";

// Reserved names from the Construct 3 SDK base classes.
// These are methods/properties on the inherited classes that must not
// be overridden by exposed ACEs, organized by inheritance layer.

// IInstance (base for all plugin instances)
const IInstance = [
  "addEventListener",
  "removeEventListener",
  "dispatchEvent",
  "runtime",
  "objectType",
  "plugin",
  "instVars",
  "behaviors",
  "uid",
  "iid",
  "templateName",
  "destroy",
  "getOtherContainerInstances",
  "otherContainerInstances",
  "dt",
  "timeScale",
  "restoreTimeScale",
  "signal",
  "waitForSignal",
  "hasTag",
  "hasTags",
  "setAllTags",
  "getAllTags",
  "callCustomAction",
];

// ISDKInstanceBase (extends IInstance)
const ISDKInstanceBase = [
  "_release",
  "_getInitProperties",
  "_trigger",
  "_triggerAsync",
  "_addDOMMessageHandler",
  "_addDOMMessageHandlers",
  "_postToDOM",
  "_postToDOMAsync",
  "_postToDOMMaybeSync",
  "_setTicking",
  "_setTicking2",
  "_isTicking",
  "_isTicking2",
  "_tick",
  "_tick2",
  "_getDebuggerProperties",
  "_saveToJson",
  "_loadFromJson",
  "_isWrapperExtensionAvailable",
  "_addWrapperExtensionMessageHandler",
  "_addWrapperMessageHandlers",
  "_sendWrapperExtensionMessage",
  "_sendWrapperExtensionMessageAsync",
];

// IWorldInstance (extends IInstance, mixed into ISDKWorldInstanceBase)
const IWorldInstance = [
  "layout",
  "layer",
  "x",
  "y",
  "setPosition",
  "getPosition",
  "offsetPosition",
  "z",
  "totalZ",
  "setPosition3d",
  "offsetPosition3d",
  "getPosition3d",
  "originX",
  "originY",
  "setOrigin",
  "getOrigin",
  "width",
  "height",
  "depth",
  "setSize",
  "setSize3d",
  "getSize",
  "getSide3d",
  "angle",
  "angleDegrees",
  "getBoundingBox",
  "getBoundingBox3d",
  "getBoundingQuad",
  "isVisible",
  "isOnScreen",
  "opacity",
  "colorRgb",
  "blendMode",
  "sampling",
  "activeSampling",
  "effects",
  "moveToTop",
  "moveToBottom",
  "moveToLayer",
  "moveAdjacentToInstance",
  "zIndex",
  "isCollisionEnabled",
  "containsPoint",
  "testOverlap",
  "testOverlapSolid",
  "createMesh",
  "releaseMesh",
  "setMeshPoint",
  "getMeshPoint",
  "getMeshSize",
  "getParent",
  "getTopParent",
  "parents",
  "getChildCount",
  "getChildAt",
  "children",
  "allChildren",
  "addChild",
  "getHierarchyOpts",
  "removeChild",
  "removeFromParent",
];

// ISDKWorldInstanceBase (extends ISDKInstanceBase + IWorldInstance)
const ISDKWorldInstanceBase = [
  "_draw",
  "_handleRendererContextLoss",
  "_onRendererContextLost",
  "_onRendererContextRestored",
];

// ISDKDOMInstanceBase (extends ISDKWorldInstanceBase)
const ISDKDOMInstanceBase = [
  "_postToDOMElement",
  "_postToDOMElementAsync",
  "_postToDOMElementMaybeSync",
  "_createElement",
  "focusElement",
  "blurElement",
  "isElementFocused",
  "setElementCSSStyle",
  "setElementAttribute",
  "removeElementAttribute",
  "setElementVisible",
  "_getElementState",
  "_updateElementState",
  "_getElementInDOMMode",
];

// IBehaviorInstance (base for behavior instances)
const IBehaviorInstance = [
  "addEventListener",
  "removeEventListener",
  "dispatchEvent",
  "instance",
  "behavior",
  "behaviorType",
  "runtime",
];

// ISDKBehaviorInstanceBase (extends IBehaviorInstance)
const ISDKBehaviorInstanceBase = [
  "_postCreate",
  "_release",
  "_getInitProperties",
  "_trigger",
  "_triggerAsync",
  "_setTicking",
  "_setTicking2",
  "_setPostTicking",
  "_isTicking",
  "_isTicking2",
  "_isPostTicking",
  "_tick",
  "_tick2",
  "_postTick",
  "_getDebuggerProperties",
  "_saveToJson",
  "_loadFromJson",
];

// Build the reserved set based on addon type and plugin type from config
function getReservedNames(addonType, pluginType) {
  if (addonType === "behavior") {
    return new Set([...IBehaviorInstance, ...ISDKBehaviorInstanceBase]);
  }

  // Plugin types: object, world, dom
  const names = [...IInstance, ...ISDKInstanceBase];

  if (pluginType === "world" || pluginType === "dom") {
    names.push(...IWorldInstance, ...ISDKWorldInstanceBase);
  }

  if (pluginType === "dom") {
    names.push(...ISDKDOMInstanceBase);
  }

  return new Set(names);
}

export default async function validateExposedNames() {
  chalkUtils.step("Validating exposed ACE names");
  let hadError = false;

  // Build the reserved name set for this addon's base class
  const reservedNames = getReservedNames(addonType, type);

  // Get the instance class's own prototype methods by calling the factory
  // with a minimal dummy base class
  let instanceMethodNames;
  try {
    const instanceModule = await import("../src/runtime/instance.js");
    const createInstance = instanceModule.default;

    class DummyBase {
      _getInitProperties() {
        return null;
      }
      _trigger() {}
      _release() {}
    }

    const InstanceClass = createInstance(DummyBase);
    instanceMethodNames = new Set(
      Object.getOwnPropertyNames(InstanceClass.prototype).filter(
        (name) => name !== "constructor"
      )
    );
  } catch (e) {
    chalkUtils.error(
      `Failed to analyze instance class: ${e.message}\n${e.stack}`
    );
    return true;
  }

  chalkUtils.info(
    `  Found ${instanceMethodNames.size} method(s) on the instance class`
  );
  chalkUtils.info(
    `  Checking against ${reservedNames.size} reserved base class name(s) (${addonType}${addonType === "plugin" ? `/${type}` : ""})`
  );

  // Check each exposed ACE set for collisions
  const aceGroups = [
    { label: "action", exposed: exposedActs },
    { label: "condition", exposed: exposedCnds },
    { label: "expression", exposed: exposedExps },
  ];

  for (const { label, exposed } of aceGroups) {
    for (const name of Object.keys(exposed)) {
      if (instanceMethodNames.has(name)) {
        chalkUtils.error(
          `Exposed ${label} ${chalkUtils._errorUnderline(
            name
          )} would override an existing method on the instance class`
        );
        hadError = true;
      }

      if (reservedNames.has(name)) {
        chalkUtils.error(
          `Exposed ${label} ${chalkUtils._errorUnderline(
            name
          )} would override a reserved base class member`
        );
        hadError = true;
      }
    }
  }

  if (hadError) {
    chalkUtils.failed(
      "Some exposed ACE names collide with existing names."
    );
  } else {
    chalkUtils.success("No exposed ACE name collisions!");
  }
  return hadError;
}

if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  validateExposedNames();
}
