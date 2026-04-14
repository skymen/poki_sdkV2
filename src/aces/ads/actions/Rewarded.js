// const adSizes = [{ Small: "Small" }, { Medium: "Medium" }, { Large: "Large" }];

export const config = {
  highlight: true,
  deprecated: false,
  isAsync: true,
  listName: "Rewarded",
  displayText: "Request {1} rewarded ad [i]{0}[/i]",
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
    // {
    //   id: "Size",
    //   name: "Size",
    //   desc: "The size of the ad",
    //   type: "combo",
    //   initialValue: "Small",
    //   items: adSizes,
    // },
  ],
};

export const expose = true;

export default async function (tag /*, size*/) {
  // if (!adSizes[size]) {
  //   size = 0;
  // }
  // let sizeStr = Object.keys(adSizes[size])[0];
  this._suspendRuntime();
  const result = await this._postToDOMAsync(
    "Rewarded" /*sizeStr.toLowerCase()*/,
  );
  this.lastRewardedSuccess = result;
  this._resumeRuntime();
  this.lastAdTag = tag;
  this._trigger("OnRewardedComplete");
  return result;
}
