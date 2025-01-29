export const config = {
  highlight: false,
  deprecated: false,
  isAsync: false,
  listName: "Sample Action Combo",
  displayText: "Sample Action Combo {0}",
  description: "This is a sample action",
  params: [
    {
      id: "param1",
      name: "Param1",
      desc: "This is a sample param",
      type: "combo",
      initialValue: "test",
      items: [{ test: "test" }, { test2: "test2" }],
    },
  ],
};

export const expose = true;

export default function (param) {
  console.log("Sample Action Combo", param);
}
