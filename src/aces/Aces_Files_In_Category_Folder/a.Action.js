export const config = {
  highlight: false,
  deprecated: false,
  isAsync: false,
  listName: "Sample Action",
  displayText: "Sample Action {0}",
  description: "This is a sample action",
  params: [
    {
      id: "param1",
      name: "Param1",
      desc: "This is a sample param",
      type: "string",
      initialValue: '"Hello World"',
    },
  ],
};

export const expose = true;

export default function (param) {
  console.log("Sample Action", param);
}
