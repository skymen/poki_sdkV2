export const config = {
  highlight: true,
  deprecated: false,
  isAsync: false,
  listName: "Gameplay Stop",
  displayText: "Gameplay Stop",
  description: "Notify the SDK that the gameplay has stopped",
  params: [],
};

export const expose = true;

export default function () {
  this._postToDOMAsync("GameplayStop");
}
