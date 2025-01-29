const SDK = globalThis.SDK;
export default function (ADDON_INFO, parentClass) {
  return class extends parentClass {
    constructor() {
      super(ADDON_INFO.id);
      SDK.Lang.PushContext(
        `${ADDON_INFO.addonType}s.${ADDON_INFO.id.toLowerCase()}`
      );
      this._info.SetName(self.lang(".name"));
      this._info.SetDescription(self.lang(".description"));
      this._info.SetCategory(ADDON_INFO.category);
      this._info.SetAuthor(ADDON_INFO.author);
      this._info.SetHelpUrl(self.lang(".help-url"));
      this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
      this._info.SetC3RuntimeScripts(["c3runtime/main.js"]);
      if (ADDON_INFO.info.icon) {
        this._info.SetIcon(
          ADDON_INFO.info.icon,
          ADDON_INFO.info.icon.endsWith(".svg") ? "image/svg+xml" : "image/png"
        );
      }

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

      if (ADDON_INFO.addonType === "plugin") {
        this._info.SetPluginType(
          ADDON_INFO.type === "object" ? "object" : "world"
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
            `c3runtime/${ADDON_INFO.info.defaultImageUrl}`
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
      }
      SDK.Lang.PushContext(".properties");
      this._info.SetProperties(
        (ADDON_INFO.properties || []).map(
          (prop) =>
            new SDK.PluginProperty(prop.type, prop.id, {
              ...prop.options,
              items:
                prop.type === "combo" && prop.options.items
                  ? prop.options.items.map((i) => Object.keys(i)[0])
                  : undefined,
            })
        )
      );
      SDK.Lang.PopContext(); // .properties
      SDK.Lang.PopContext();
    }
  };
}
