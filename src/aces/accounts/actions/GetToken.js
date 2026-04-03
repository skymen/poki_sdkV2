export const config = {
  highlight: false,
  deprecated: false,
  isAsync: true,
  listName: "Get Token",
  displayText: "Get authentication token",
  description:
    "Fetch a short-lived JWT token for the current user. The token expires in 1 minute.",
  params: [],
};

export const expose = true;

export default async function () {
  try {
    const token = await this._postToDOMAsync("GetToken");
    this._currentToken = token;
    this._trigger("OnGetToken");
  } catch (e) {
    this._currentToken = null;
  }
}
