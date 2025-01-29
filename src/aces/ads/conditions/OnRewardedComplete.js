export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Rewarded Complete",
  displayText: "On Rewarded [i]{0}[/i] Complete",
  description: "Triggered when a rewarded ad is completed",
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
  return tag === "" || tag === this._lastTriggeredTag;
}
