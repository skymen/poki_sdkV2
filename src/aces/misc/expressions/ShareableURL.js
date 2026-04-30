export const config = {
  highlight: false,
  deprecated: false,
  returnType: "string",
  description: "The last generated shareable URL",
  params: [],
};

export const expose = false;

export default function () {
  return this._shareableURL || "";
}
