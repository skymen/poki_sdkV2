export const config = {
  highlight: false,
  deprecated: false,
  isTrigger: true,
  listName: "On Login Failed",
  displayText: "On login failed",
  description:
    "Triggered when login fails (user closed auth panel or login timed out)",
  params: [],
};

export const expose = false;

export default function () {
  return true;
}
