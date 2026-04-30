export const config = {
  highlight: false,
  deprecated: false,
  isAsync: true,
  listName: "Get Shareable URL",
  displayText: "Get shareable URL with params [i]{0}[/i]",
  description:
    "Generate a shareable Poki URL with custom parameters. Parameters are passed as a JSON string.",
  params: [
    {
      id: "params",
      name: "Params",
      desc: 'JSON string of parameters (e.g. {"id":"myid","type":"mytype"})',
      type: "string",
      initialValue: '"{}"',
    },
  ],
};

export const expose = true;

export default async function (params) {
  const result = await this._postToDOMAsync("GetShareableURL", { params });
  this._shareableURL = result;
  this._trigger("OnShareableURL");
}
