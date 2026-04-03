export const config = {
  highlight: false,
  deprecated: false,
  returnType: "string",
  description: "The avatar URL of the currently logged-in user",
  params: [],
};

export const expose = false;

export default function () {
  return this._currentUser?.avatarUrl || "";
}
