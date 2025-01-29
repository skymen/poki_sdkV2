export const config = {
  highlight: false,
  deprecated: false,
  isAsync: true,
  listName: "Sample Action Async",
  displayText: "Sample Action Async",
  description: "This is a sample action",
  params: [],
};

export const expose = false;

export default function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Sample Action Async");
      resolve();
    }, 1000);
  });
}
