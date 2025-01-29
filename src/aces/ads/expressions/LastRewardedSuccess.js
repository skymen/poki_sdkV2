export const config = {
  highlight: true,
  deprecated: false,
  returnType: "number",
  description: "Last Rewarded Success",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastRewardedSuccess ? 1 : 0;
}
