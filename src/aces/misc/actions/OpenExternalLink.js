export const config = {
  highlight: false,
  deprecated: false,
  isAsync: false,
  listName: "Open External Link",
  displayText: "Open external link [i]{0}[/i]",
  description:
    "Open an external link using Poki's openExternalLink API",
  params: [
    {
      id: "url",
      name: "URL",
      desc: "The URL to open",
      type: "string",
      initialValue: '""',
    },
  ],
};

export const expose = true;

export default function (url) {
  this._postToDOMAsync("OpenExternalLink", { url });
}
