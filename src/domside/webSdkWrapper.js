import { addScript, preventWeirdInputs } from "./utils.js";
import { listen, dispatch, listenOnce } from "./eventDispatcher.js";

preventWeirdInputs();

let sdk;
let currentSdk = null;
let enabled = false;
const sdkContext = {
  hasUserInteracted: false,
  pendingGameplayStart: false,
  gameplayStarted: false,
};

let supportedNetworks = [
  {
    name: "Poki",
    get sdk() {
      return globalThis.PokiSDK;
    },
    scriptSrc: "//game-cdn.poki.com/scripts/v2/poki-sdk.js",
    hasAds: true,
    noInterstitial: false,
    noRewarded: false,
    hasBanner: false,
    enableOnlyInProduction: false,
    implementation: {
      //async preInit(debug = false) {},
      init(debug = false, data) {
        return new Promise((resolve) => {
          sdk
            .init()
            .then(() => {
              resolve();
            })
            .catch(() => {
              resolve();
            });
          sdk.setDebug(debug);
        });
      },
      setUpEventListeners(debug, data) {
        let lastBeaconTime = 0;
        let maxBeacons = data.poki_maxBeacons || 6;
        let beaconInterval = data.poki_beaconInterval || 60;
        const beacon = (type) => {
          if (data.poki_gameId && data.poki_doBeacon) {
            let currentTime = Date.now();
            if (
              currentTime - lastBeaconTime < beaconInterval * 1000 ||
              maxBeacons <= 0
            )
              return;

            lastBeaconTime = currentTime;
            maxBeacons--;

            navigator.sendBeacon(
              `https://leveldata.poki.io/${type}`,
              data.poki_gameId
            );
          }
        };

        listen("loadingStart", () => {
          sdk.gameLoadingStart();
        });
        listen("loadingEnd", () => {
          sdk.gameLoadingFinished();
          beacon("loadingEnd");
        });
        listen("gameplayStart", () => {
          beacon("gameplayStart");
          if (sdkContext.gameplayStarted) return;

          // If user hasn't interacted yet, delay gameplay start
          if (
            !sdkContext.hasUserInteracted &&
            data.poki_autoDelayGameplayStart
          ) {
            sdkContext.pendingGameplayStart = true;
            console.log("Delaying gameplay start until user interaction...");
            return;
          }

          sdkContext.gameplayStarted = true;
          sdk.gameplayStart();
        });
        listen("gameplayStop", () => {
          beacon("gameplayStop");
          sdkContext.pendingGameplayStart = false;
          if (!sdkContext.gameplayStarted) return;
          sdkContext.gameplayStarted = false;
          sdk.gameplayStop();
        });
        listen("interstitial", () => {
          beacon("interstitial");
          dispatch("adStarted", sdkContext.lastRequestedAd);
          sdk.commercialBreak().then(() => {
            dispatch("interstitialEnd", true);
          });
        });
        listen("rewarded", (size) => {
          beacon("rewarded");
          let lastRequestedAd = sdkContext.lastRequestedAd;
          sdk
            .rewardedBreak({
              size: size || "medium",
              onStart: () => {
                dispatch("adStarted", lastRequestedAd);
              },
            })
            .then((success) => {
              dispatch("rewardedEnd", success);
            });
        });
        listen("analyticsEvent", (category, what, action) => {
          beacon(`${category}_${action}`);
          sdk.measure(category, what, action);
        });
      },
    },
  },
];

// Setup user interaction listener
function setupUserInteractionListener() {
  const handleInteraction = () => {
    if (!sdkContext.hasUserInteracted) {
      sdkContext.hasUserInteracted = true;
      console.log("User interaction detected for SDK");

      // If there's a pending gameplay start, trigger it now
      if (sdkContext.pendingGameplayStart && !sdkContext.gameplayStarted) {
        sdkContext.pendingGameplayStart = false;
        sdkContext.gameplayStarted = true;
        if (sdk && sdk.gameplayStart) {
          sdk.gameplayStart();
          console.log("Triggered delayed gameplay start");
        }
      }
    }
  };

  // Listen for user interactions
  document.addEventListener("click", handleInteraction, { once: true });
  document.addEventListener("keydown", handleInteraction, { once: true });
  document.addEventListener("touchstart", handleInteraction, { once: true });
}

const Wrapper = {
  get enabled() {
    return enabled;
  },
  get currentSdk() {
    return currentSdk;
  },
  init(name, debug = false, data = {}) {
    return new Promise(async (resolve) => {
      currentSdk = supportedNetworks.find(
        (x) => x.name.toLowerCase() === name.toLowerCase()
      );
      if (currentSdk) {
        enabled = true;
        if (currentSdk.enableOnlyInProduction && debug) {
          enabled = false;
          resolve();
        } else {
          if (currentSdk.implementation.preInit)
            await currentSdk.implementation.preInit(debug, data);
          if (currentSdk.scriptSrc) {
            const onInit = async () => {
              sdk = currentSdk.sdk;
              currentSdk.implementation.setUpEventListeners(debug, data);
              if (currentSdk.implementation.init)
                await currentSdk.implementation.init(debug, data);

              // Setup user interaction listener for delayed gameplay start
              setupUserInteractionListener();

              Wrapper.loadingStart();
              resolve();
            };

            if (currentSdk.scriptSrc instanceof Array) {
              await Promise.all(
                currentSdk.scriptSrc.map(
                  (src) =>
                    new Promise((resolve) => {
                      addScript(src, currentSdk.name + "-jssdk", resolve);
                    })
                )
              );
              onInit();
            } else {
              addScript(
                currentSdk.scriptSrc,
                currentSdk.name + "-jssdk",
                onInit
              );
            }
          } else {
            resolve();
          }
        }
      } else {
        resolve();
      }
    });
  },
  loadingStart() {
    dispatch("loadingStart");
    dispatch("loadingProgress", 0);
  },
  loadingEnd() {
    dispatch("loadingProgress", 100);
    dispatch("loadingEnd");
  },
  gameplayStart() {
    dispatch("gameplayStart");
  },
  gameplayStop() {
    dispatch("gameplayStop");
  },
  levelStart(level) {
    dispatch("levelStart", level);
  },
  replayLevel(level) {
    dispatch("replayLevel", level);
  },
  onUnlockAllLevels(fn) {
    window.unlockAllLevels = fn;
  },
  interstitial() {
    sdkContext.lastRequestedAd = "interstitial";
    if (!currentSdk || !currentSdk.hasAds || currentSdk.noInterstitial) {
      dispatch("adStarted", sdkContext.lastRequestedAd);
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      let gameplayStarted = sdkContext.gameplayStarted;
      if (gameplayStarted) Wrapper.gameplayStop();
      dispatch("interstitial");
      listenOnce("interstitialEnd", (...args) => {
        if (gameplayStarted) Wrapper.gameplayStart();
        resolve(...args);
      });
    });
  },
  rewarded(size) {
    sdkContext.lastRequestedAd = "rewarded";
    if (!currentSdk || !currentSdk.hasAds || currentSdk.noRewarded) {
      dispatch("adStarted", sdkContext.lastRequestedAd);
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      let gameplayStarted = sdkContext.gameplayStarted;
      if (gameplayStarted) Wrapper.gameplayStop();
      dispatch("rewarded", size);
      listenOnce("rewardedEnd", (...args) => {
        if (gameplayStarted) Wrapper.gameplayStart();
        resolve(...args);
      });
    });
  },
  onAdStarted(fn) {
    listen("adStarted", fn);
  },
  hasAds() {
    return currentSdk && currentSdk.hasAds ? 1 : 0;
  },
  hasInterstitialAds() {
    return currentSdk && currentSdk.hasAds && !currentSdk.noInterstitial
      ? 1
      : 0;
  },
  hasRewardedAds() {
    return currentSdk && currentSdk.hasAds && !currentSdk.noRewarded ? 1 : 0;
  },
  analyticsEvent({ category, what, action }) {
    dispatch("analyticsEvent", category, what, action);
  },
};

export default Wrapper;
