export const config = {
  highlight: false,
  deprecated: false,
  returnType: "string",
  description: "The username of the currently logged-in user",
  params: [],
};

export const expose = false;

export default function () {
  return this._currentUser?.username || "";
}
