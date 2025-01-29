export const config = {
  highlight: false,
  deprecated: false,
  listName: "Sample Condition",
  displayText: "Sample Condition {0}",
  description: "This is a sample condition",
  params: [
    {
      id: "param1",
      name: "Param1",
      desc: "This is a sample param",
      type: "combo",
      initialValue: "TRUE",
      items: [{ TRUE: "True" }, { FALSE: "False" }],
    },
  ],
};

export const expose = true;

export default function (param) {
  return param === 0;
}
