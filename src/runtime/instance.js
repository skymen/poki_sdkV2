import { id } from "../../config.caw.js";

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      this.sdkLoaded = false;
      this.enabled = false;
      this.lastRewardedSuccess = false;
      this._debugModeActive = false;
      this.lastAdTag = "";
      this.hasAds = false;
      this.hasInterstitialAds = false;
      this.hasRewardedAds = false;
      this._willSuspend = false;

      // Props
      this._enabledMode = 0;
      this._debugOnPreview = false;
      this._loadingNotification = 0; // Immediate
      this._automaticSuspend = true;
      this._suspendTimeout = 300;
      this._gameId = "";
      this._doBeacon = false;
      this._beaconInterval = 60;
      this._maxBeacons = 6;

      const properties = this._getInitProperties();
      if (properties) {
        // note properties may be null in some cases
        [
          this._enabledMode,
          this._debugOnPreview,
          this._gameId,
          this._doBeacon,
          this._beaconInterval,
          this._maxBeacons,
          this._loadingNotification,
          this._automaticSuspend,
          this._suspendTimeout,
        ] = properties;
      }

      this.config = {
        poki_gameId: this._gameId,
        poki_doBeacon: this._doBeacon,
        poki_beaconInterval: this._beaconInterval,
        poki_maxBeacons: this._maxBeacons,
      };

      this.enabled =
        this._enabledMode === 2 ||
        (this._enabledMode === 1 && !this._isPreview());

      this._addDOMMessageHandlers([
        ["SuspendRuntime", this._suspendRuntime.bind(this)],
        ["ResumeRuntime", this._resumeRuntime.bind(this)],
      ]);

      if (this._loadingNotification === 0) {
        // Immediate
        runOnStartup(async (runtime) => {
          runtime.addEventListener("beforeprojectstart", () => {
            this._postToDOMAsync("LoadingEnd");
          });
        });
      } else if (this._loadingNotification === 1) {
        //After First Layout
        let ignoreFirstLayout = true;
        runOnStartup(async (runtime) => {
          const sendLoadFinishOnLayoutStart = () => {
            if (ignoreFirstLayout) {
              ignoreFirstLayout = false;
              return;
            }
            this._postToDOMAsync("LoadingEnd");
            runtime.getAllLayouts().forEach((layout) => {
              layout.removeEventListener(
                "beforelayoutstart",
                sendLoadFinishOnLayoutStart
              );
            });
          };
          runtime
            .getAllLayouts()
            .forEach((layout) =>
              layout.addEventListener(
                "beforelayoutstart",
                sendLoadFinishOnLayoutStart
              )
            );
        });
      }

      if (this.enabled) {
        this._debugModeActive = this._debugOnPreview && this._isPreview();

        this.runtime.sdk.addLoadPromise(
          this._postToDOMAsync("Init", {
            debug: this._debugModeActive,
            config: this.config,
          })
            .then(({ enabled, hasAds, hasInterstitialAds, hasRewardedAds }) => {
              this.sdkLoaded = enabled;
              this.hasAds = hasAds;
              this.hasInterstitialAds = hasInterstitialAds;
              this.hasRewardedAds = hasRewardedAds;
            })
            .catch(console.error)
        );
      }
    }

    _trigger(method) {
      super._trigger(self.C3.Plugins[id].Cnds[method]);
    }

    _isPreview() {
      return this.runtime.platformInfo.exportType === "preview";
    }

    _release() {
      super._release();
    }

    _saveToJson() {
      return {
        // data to be saved for savegames
      };
    }

    _loadFromJson(o) {
      // load state for savegames
    }

    _suspendRuntime() {
      if (!this._automaticSuspend) return;
      if (this._suspendTimeout <= 0) {
        this.runtime.sdk.setSuspended(true);
        return;
      }
      this._willSuspend = true;
      setTimeout(() => {
        if (!this._willSuspend) return;
        this.runtime.sdk.setSuspended(true);
        this._willSuspend = false;
      }, this._suspendTimeout);
    }
    _resumeRuntime() {
      if (!this._automaticSuspend) return;
      this._willSuspend = false;
      if (!this.runtime.isSuspended) return;
      this.runtime.sdk.setSuspended(false);
    }
  };
}
