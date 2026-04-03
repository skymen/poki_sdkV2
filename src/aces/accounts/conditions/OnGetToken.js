export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Get Token",
  displayText: "On get token",
  description: "Triggered when a JWT token has been successfully fetched",
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
