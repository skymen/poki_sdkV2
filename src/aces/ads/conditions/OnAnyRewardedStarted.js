export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Any Rewarded Started",
  displayText: "On any rewarded started",
  description: "Triggered when any rewarded ad starts playing, regardless of tag",
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
