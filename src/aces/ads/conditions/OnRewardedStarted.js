export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Rewarded Started",
  displayText: "On Rewarded [i]{0}[/i] Started",
  description: "Triggered when a rewarded ad with the given tag starts playing",
  params: [
    {
      id: "tag",
      autocompleteId: "rewardedTag",
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
