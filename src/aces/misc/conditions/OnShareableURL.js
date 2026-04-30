export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Shareable URL",
  displayText: "On shareable URL generated",
  description: "Triggered when a shareable URL has been generated",
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
