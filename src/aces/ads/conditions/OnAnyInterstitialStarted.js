export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Any Interstitial Started",
  displayText: "On any interstitial started",
  description: "Triggered when any interstitial ad starts playing, regardless of tag",
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
