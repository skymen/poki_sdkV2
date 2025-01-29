export const config = {
  highlight: true,
  deprecated: false,
  isAsync: true,
  listName: "Rewarded",
  displayText: "Request rewarded ad [i]{0}[/i]",
  description: "Request a rewarded ad",
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

export const expose = true;

export default async function (tag) {
  this._suspendRuntime();
  const result = await this._postToDOMAsync("Rewarded");
  this.lastRewardedSuccess = result;
  this._resumeRuntime();
  this._lastTriggeredTag = tag;
  this._trigger("OnRewardedComplete");
  return result;
}
