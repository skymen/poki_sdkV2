export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On User Changed",
  displayText: "On user changed",
  description:
    "Triggered when the user state changes (after loading or after login)",
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
