export const config = {
  highlight: true,
  deprecated: false,
  listName: "Last Rewarded Success",
  displayText: "Last Rewarded Success",
  description: "Last Rewarded Success",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastRewardedSuccess;
}
