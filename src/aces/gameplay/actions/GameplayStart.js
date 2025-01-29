export const config = {
  highlight: true,
  deprecated: false,
  isAsync: false,
  listName: "Gameplay Start",
  displayText: "Gameplay Start",
  description: "Notify the SDK that the gameplay has started",
  params: [],
};

export const expose = true;

export default function () {
  this._postToDOMAsync("GameplayStart");
}
