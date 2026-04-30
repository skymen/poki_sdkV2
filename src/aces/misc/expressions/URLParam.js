export const config = {
  highlight: false,
  deprecated: false,
  returnType: "string",
  description: "Get a URL parameter value by name",
  params: [
    {
      id: "name",
      name: "Name",
      desc: "The name of the URL parameter",
      type: "string",
    },
  ],
};

export const expose = false;

export default function (name) {
  return this._urlParams["gd" + name] || this._urlParams[name] || "";
}
