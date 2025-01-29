export const config = {
  highlight: false,
  deprecated: false,
  isAsync: false,
  listName: "Loading End",
  displayText: "Loading End",
  description: "Manually notify the SDK that the game has finished loading",
  params: [],
};

export const expose = true;

export default function () {
  this._postToDOMAsync("LoadingEnd");
}
