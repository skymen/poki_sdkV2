export const config = {
  highlight: true,
  deprecated: false,
  isAsync: true,
  listName: "Interstitial",
  displayText: "Request interstitial ad [i]{0}[/i]",
  description: "Request an interstitial ad",
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

export const expose = true;

export default async function (tag) {
  this._suspendRuntime();
  await this._postToDOMAsync("Interstitial");
  this._resumeRuntime();
  this.lastAdTag = tag;
  this._trigger("OnIntertsitialComplete");
}
