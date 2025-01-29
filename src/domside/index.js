import WebSdkWrapper from "./webSdkWrapper";

export default function (parentClass) {
  return class extends parentClass {
    constructor(iRuntime) {
      super(iRuntime);
      this.AddRuntimeMessageHandlers([
        ["Init", this.Init.bind(this)],
        ["LoadingEnd", WebSdkWrapper.loadingEnd],
        ["GameplayStart", WebSdkWrapper.gameplayStart],
        ["GameplayStop", WebSdkWrapper.gameplayStop],
        ["Interstitial", WebSdkWrapper.interstitial],
        ["Rewarded", WebSdkWrapper.rewarded],
        ["AnalyticsEvent", WebSdkWrapper.analyticsEvent],
      ]);
    }

    async Init({ debug, config }) {
      WebSdkWrapper.onAdStarted(() => {
        this.PostToRuntime("AdStarted");
      });
      WebSdkWrapper.onUnlockAllLevels(() => {
        this.PostToRuntime("UnlockAllLevels");
      });

      await WebSdkWrapper.init("Poki", debug, config);

      return {
        enabled: WebSdkWrapper.enabled,
        hasAds: WebSdkWrapper.hasAds(),
        hasInterstitialAds: WebSdkWrapper.hasInterstitialAds(),
        hasRewardedAds: WebSdkWrapper.hasRewardedAds(),
      };
    }
  };
}
