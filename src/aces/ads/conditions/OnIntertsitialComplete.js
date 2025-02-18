export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Interstitial Complete",
  displayText: "On Interstitial [i]{0}[/i] Complete",
  description: "Triggered when an interstitial ad is completed",
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
  return tag === "" || this.lastAdTag === tag;
}
