export const config = {
  highlight: false,
  deprecated: false,
  listName: "SDK Is Enabled",
  displayText: "SDK is enabled",
  description: "Check if the SDK is enabled",
  params: [],
};

export const expose = false;

export default function () {
  return this.enabled;
}
