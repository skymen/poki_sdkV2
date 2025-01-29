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
      name: "Action",
      desc: "The action of the event",
      type: "string",
      initialValue: "",
    },
    {
      id: "label",
      name: "Label",
      desc: "The label of the event",
      type: "string",
      initialValue: "",
    },
  ],
};

export const expose = true;

export default function (category, action, label) {
  this._postToDOMAsync("AnalyticsEvent", { category, action, label });
}
