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
  try {
    await this._postToDOMAsync("Login");
  } catch (e) {
    this._lastLoginError = e?.message || "Login failed";
    this._trigger("OnLoginFailed");
  }
}
