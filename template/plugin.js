const SDK = globalThis.SDK;
export default function (ADDON_INFO, parentClass) {
  return class extends parentClass {
    constructor() {
      super(ADDON_INFO.id);
      SDK.Lang.PushContext(
        `${ADDON_INFO.addonType}s.${ADDON_INFO.id.toLowerCase()}`,
      );
      this._info.SetName(self.lang(".name"));
      this._info.SetDescription(self.lang(".description"));
      this._info.SetCategory(ADDON_INFO.category);
      this._info.SetAuthor(ADDON_INFO.author);
      this._info.SetHelpUrl(self.lang(".help-url"));
      if (this._info.SetRuntimeModuleMainScript)
        this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
      if (this._info.SetC3RuntimeScripts)
        this._info.SetC3RuntimeScripts(["c3runtime/main.js"]);
      if (ADDON_INFO.info.icon) {
        this._info.SetIcon(
          ADDON_INFO.info.icon,
          ADDON_INFO.info.icon.endsWith(".svg") ? "image/svg+xml" : "image/png",
        );
      }

      const properties = [];
      const propertiesMap = {};
      (ADDON_INFO.properties || []).forEach((prop) => {
        const sdkProp = new SDK.PluginProperty(prop.type, prop.id, {
          ...prop.options,
          items:
            prop.type === "combo" && prop.options.items
              ? prop.options.items.map((i) => Object.keys(i)[0])
              : undefined,
        });
        properties.push(sdkProp);
        propertiesMap[prop.id] = sdkProp;
      });

      if (ADDON_INFO.info && ADDON_INFO.info.Set) {
        Object.keys(ADDON_INFO.info.Set).forEach((key) => {
          const value = ADDON_INFO.info.Set[key];
          const fn = this._info[`Set${key}`];
          if (fn && value !== null && value !== undefined)
            fn.call(this._info, value);
        });
      }

      if (ADDON_INFO.files.fileDependencies) {
        ADDON_INFO.files.fileDependencies.forEach((file) => {
          this._info.AddFileDependency({
            ...file,
            filename: `c3runtime/${file.filename}`,
          });
        });
      }

      if (ADDON_INFO.files.remoteFileDependencies) {
        ADDON_INFO.files.remoteFileDependencies.forEach((file) => {
          this._info.AddRemoteScriptDependency(
            file.src,
            file.type === "module" ? "module" : undefined,
          );
        });
      }

      if (ADDON_INFO.addonType === "plugin") {
        this._info.SetPluginType(
          ADDON_INFO.type === "object" ? "object" : "world",
        );

        if (ADDON_INFO.info && ADDON_INFO.info.AddCommonACEs) {
          Object.keys(ADDON_INFO.info.AddCommonACEs).forEach((key) => {
            if (ADDON_INFO.info.AddCommonACEs[key])
              this._info[`AddCommon${key}ACEs`]();
          });
        }

        if (
          ADDON_INFO.info.defaultImageUrl &&
          ADDON_INFO.type === "world" &&
          ADDON_INFO.info.Set.HasImage
        ) {
          this._info.SetDefaultImageURL(
            `c3runtime/${ADDON_INFO.info.defaultImageUrl}`,
          );
        }

        if (ADDON_INFO.hasDomside) {
          this._info.SetDOMSideScripts(["c3runtime/domside.js"]);
        }

        if (
          ADDON_INFO.files.extensionScript &&
          ADDON_INFO.files.extensionScript.enabled
        ) {
          const targets = ADDON_INFO.files.extensionScript.targets || [];
          targets.forEach((target) => {
            this._info.AddFileDependency({
              filename: `${ADDON_INFO.id}_${target.toLowerCase()}.ext.dll`,
              type: "wrapper-extension",
              platform: `windows-${target.toLowerCase()}`,
            });
          });
        }

        if (ADDON_INFO.files.cordovaPluginReferences) {
          ADDON_INFO.files.cordovaPluginReferences.forEach((plugin) => {
            this._info.AddCordovaPluginReference({
              id: plugin.id,
              plugin:
                plugin.plugin && plugin.plugin instanceof Function
                  ? plugin.plugin(this)
                  : plugin.variables
                    ? this
                    : undefined,
              version: plugin.version,
              platform: plugin.platform,
              variables: plugin.variables
                ? plugin.variables.map((v) => [v[0], propertiesMap[v[1]]])
                : undefined,
            });
          });
        }

        if (ADDON_INFO.files.cordovaResourceFiles) {
          ADDON_INFO.files.cordovaResourceFiles.forEach((file) => {
            this._info.AddCordovaResourceFile(file);
          });
        }
      }

      SDK.Lang.PushContext(".properties");
      this._info.SetProperties(properties);
      SDK.Lang.PopContext(); // .properties
      SDK.Lang.PopContext();
    }
  };
}
