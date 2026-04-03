export const config = {
  highlight: false,
  deprecated: false,
  listName: "Is Logged In",
  displayText: "User is logged in",
  description: "Check if a user is currently logged in",
  params: [],
};

export const expose = false;

export default function () {
  return this._currentUser !== null;
}
