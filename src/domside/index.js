import WebSdkWrapper from "./webSdkWrapper";

export default function (parentClass) {
  return class extends parentClass {
    constructor(iRuntime) {
      super(iRuntime);
      this.AddRuntimeMessageHandlers([
        ["Init", this.Init.bind(this)],
        ["LoadingEnd", this._onLoadingEnd.bind(this)],
        ["GameplayStart", WebSdkWrapper.gameplayStart],
        ["GameplayStop", WebSdkWrapper.gameplayStop],
        ["Interstitial", WebSdkWrapper.interstitial],
        ["Rewarded", WebSdkWrapper.rewarded],
        ["AnalyticsEvent", WebSdkWrapper.analyticsEvent],
        [
          "MovePill",
          (data) => WebSdkWrapper.movePill(data.topPercent, data.topPx),
        ],
        [
          "OpenExternalLink",
          (data) => WebSdkWrapper.openExternalLink(data.url),
        ],
        ["Login", this._onLogin.bind(this)],
        ["GetToken", () => WebSdkWrapper.getToken()],
        [
          "GetShareableURL",
          (data) => WebSdkWrapper.shareableURL(data.params),
        ],
      ]);
    }

    async _onLoadingEnd() {
      WebSdkWrapper.loadingEnd();
      if (WebSdkWrapper.hasAccounts()) {
        try {
          const user = await WebSdkWrapper.getUser();
          this.PostToRuntime("UserChanged", user);
        } catch (e) {
          // accounts not available or user opted out
          this.PostToRuntime("UserChanged", null);
        }
      }
    }

    async _onLogin() {
      await WebSdkWrapper.login();
      // If we reach here, user was already logged in (no page refresh)
      // Fetch user and notify runtime
      if (WebSdkWrapper.hasAccounts()) {
        try {
          const user = await WebSdkWrapper.getUser();
          this.PostToRuntime("UserChanged", user);
        } catch (e) {
          this.PostToRuntime("UserChanged", null);
        }
      }
    }

    async Init({ debug, config }) {
      WebSdkWrapper.onAdStarted(() => {
        this.PostToRuntime("AdStarted");
      });
      WebSdkWrapper.onUnlockAllLevels(() => {
        this.PostToRuntime("UnlockAllLevels");
      });

      await WebSdkWrapper.init("Poki", debug, config);

      const urlParams = {};
      new URLSearchParams(window.location.search).forEach((value, key) => {
        urlParams[key] = value;
      });

      return {
        enabled: WebSdkWrapper.enabled,
        hasAds: WebSdkWrapper.hasAds(),
        hasInterstitialAds: WebSdkWrapper.hasInterstitialAds(),
        hasRewardedAds: WebSdkWrapper.hasRewardedAds(),
        hasAccounts: WebSdkWrapper.hasAccounts(),
        hasToken: WebSdkWrapper.hasToken(),
        urlParams,
      };
    }
  };
}
