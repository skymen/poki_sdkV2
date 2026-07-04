export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Interstitial Started",
  displayText: "On Interstitial [i]{0}[/i] Started",
  description: "Triggered when an interstitial ad with the given tag starts playing",
  params: [
    {
      id: "tag",
      autocompleteId: "interstitialTag",
      name: "Tag",
      desc: "The tag of the ad",
      type: "string",
      initialValue: "",
    },
  ],
};

export const expose = false;

export default function (tag) {
  return tag === "" || tag === this.lastAdTag;
}
