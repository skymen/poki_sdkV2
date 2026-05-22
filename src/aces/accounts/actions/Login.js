export const config = {
  highlight: true,
  deprecated: false,
  isAsync: true,
  listName: "Login",
  displayText: "Prompt user login",
  description:
    "Prompt the user to log in. If the user logs in, the page will refresh. If already logged in, resolves immediately.",
  params: [],
};

export const expose = true;

export default async function () {
  const result = await this._postToDOMAsync("Login");
  if (!result || !result.ok) {
    this._trigger("OnLoginFailed");
  }
}
