export const config = {
  highlight: false,
  deprecated: true,
  isAsync: false,
  listName: "Send Event",
  displayText: "Send Analytics Event [i]{0}[/i], [i]{1}[/i], [i]{2}[/i]",
  description: "Send an analytics event",
  params: [
    {
      id: "category",
      name: "Category",
      desc: "The category of the event",
      type: "string",
      initialValue: "",
    },
    {
      id: "action",
      name: "What",
      desc: "What the event is about",
      type: "string",
      initialValue: "",
    },
    {
      id: "label",
      name: "Action",
      desc: "The action that was taken",
      type: "string",
      initialValue: "",
    },
  ],
};

export const expose = true;

export default function (category, what, action) {
  this._postToDOMAsync("AnalyticsEvent", { category, what, action });
}
