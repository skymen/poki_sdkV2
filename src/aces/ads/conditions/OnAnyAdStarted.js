export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Any Ad Started",
  displayText: "On any ad started",
  description: "Triggered when any ad (interstitial or rewarded) starts playing",
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
