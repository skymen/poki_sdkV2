import {
  ADDON_CATEGORY,
  ADDON_TYPE,
  PLUGIN_TYPE,
  PROPERTY_TYPE,
} from "./template/enums.js";
import _version from "./version.js";
export const addonType = ADDON_TYPE.PLUGIN;
export const type = PLUGIN_TYPE.OBJECT;
export const id = "skymen_pokiSDK";
export const name = "Poki SDK";
export const version = _version;
export const author = "skymen, Avix Games";
export const website = "https://github.com/skymen/poki_sdkV2";
export const documentation = "https://sdk.poki.com/";
export const description =
  "Simple plugin for games to be hosted on the Poki Platform (https://sdk.poki.com/)";
export const category = ADDON_CATEGORY.PLATFORM_SPECIFIC;

export const hasDomside = true;
export const files = {
  extensionScript: {},
  fileDependencies: [],
};

// categories that are not filled will use the folder name
export const aceCategories = {};

export const info = {
  // icon: "icon.svg",
  // PLUGIN world only
  // defaultImageUrl: "default-image.png",
  Set: {
    // COMMON to all
    CanBeBundled: true,
    IsDeprecated: false,
    GooglePlayServicesEnabled: false,

    // BEHAVIOR only
    IsOnlyOneAllowed: false,

    // PLUGIN world only
    IsResizable: false,
    IsRotatable: false,
    Is3D: false,
    HasImage: false,
    IsTiled: false,
    SupportsZElevation: false,
    SupportsColor: false,
    SupportsEffects: false,
    MustPreDraw: false,

    // PLUGIN object only
    IsSingleGlobal: true,
  },
  // PLUGIN only
  AddCommonACEs: {
    Position: false,
    SceneGraph: false,
    Size: false,
    Angle: false,
    Appearance: false,
    ZOrder: false,
  },
};

export const properties = [
  /*
  {
    type:
      "integer"
      "float"
      "percent"
      "text"
      "longtext"
      "check"
      "font"
      "combo"
      "color"
      "object"
      "group"
      "link"
      "info"

    id: "property_id",
    options: {
      initialValue: 0,
      interpolatable: false,

      // minValue: 0, // omit to disable
      // maxValue: 100, // omit to disable

      // for type combo only
      // items: [
      //   {itemId1: "item name1" },
      //   {itemId2: "item name2" },
      // ],

      // dragSpeedMultiplier: 1, // omit to disable

      // for type object only
      // allowedPluginIds: ["Sprite", "<world>"],

      // for type link only
      // linkCallback: `function(instOrObj) {}`,
      // linkText: "Link Text",
      // callbackType:
      //   "for-each-instance"
      //   "once-for-type"

      // for type info only
      // infoCallback: `function(inst) {}`,
    },
    name: "Property Name",
    desc: "Property Description",
  }
  */
  {
    type: "combo",
    id: "enabled",
    options: {
      initialValue: "enabled_export",
      items: [
        { disabled: "Disabled" },
        { enabled_export: "Enabled on export" },
        { enabled: "Enabled" },
      ],
    },
    name: "Enabled",
    desc: "Whether the SDK is enabled",
  },
  {
    type: "check",
    id: "debug",
    options: {
      initialValue: true,
    },
    name: "Debug on preview",
    desc: "Whether to enable debug mode",
  },
  {
    type: "text",
    id: "gameId",
    options: {
      initialValue: "",
    },
    name: "Game ID",
    desc: "Enter the ID of the game here for the beacon to work",
  },
  {
    type: "check",
    id: "doBeacon",
    options: {
      initialValue: true,
    },
    name: "Do beacon",
    desc: "Whether to send beacons to Poki",
  },
  {
    type: "integer",
    id: "beaconInterval",
    options: {
      initialValue: 60,
    },
    name: "Beacon interval",
    desc: "Number of seconds between beacons",
  },
  {
    type: "integer",
    id: "maxBeacons",
    options: {
      initialValue: 6,
    },
    name: "Max beacons",
    desc: "Maximum number of beacons to send",
  },
  {
    type: "combo",
    id: "loadingNotification",
    options: {
      initialValue: "immediate",
      items: [
        { immediate: "Immediate" },
        { afterFirstLayout: "After first layout" },
        { manual: "Manual" },
      ],
    },
    name: "Loading notification",
    desc: "When to notify the DOM that the game has finished loading",
  },
  {
    type: "check",
    id: "automaticSuspend",
    options: {
      initialValue: true,
    },
    name: "Automatic suspend",
    desc: "Automatically suspend the SDK when the game is suspended",
  },
  {
    type: "integer",
    id: "suspendTimeout",
    options: {
      initialValue: 300,
      minValue: 0,
    },
    name: "Suspend timeout",
    desc: "Number of seconds to wait before suspending the SDK",
  },
];
