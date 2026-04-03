export const config = {
  highlight: false,
  deprecated: false,
  returnType: "string",
  description: "The last fetched JWT authentication token",
  params: [],
};

export const expose = false;

export default function () {
  return this._currentToken || "";
}
