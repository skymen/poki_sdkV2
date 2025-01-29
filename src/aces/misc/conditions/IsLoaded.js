export const config = {
  highlight: false,
  deprecated: false,
  listName: "SDK Is Loaded",
  displayText: "SDK is loaded",
  description: "Check if the SDK is loaded",
  params: [],
};

export const expose = false;

export default function () {
  return this.sdkLoaded;
}
