export const config = {
  highlight: false,
  deprecated: false,
  isAsync: false,
  listName: "Submit Score",
  displayText: "Submit score [i]{0}[/i] with value [i]{1}[/i]",
  description:
    "Submit a score using Poki's submitScore API",
  params: [
    {
      id: "name",
      name: "Name",
      desc: "The name of the leaderboard",
      type: "string",
      initialValue: '""',
    },
    {
      id: "score",
      name: "Score",
      desc: "The score to submit",
      type: "number",
      initialValue: "0",
    },
  ],
};

export const expose = true;

export default function (name, score) {
  this._postToDOMAsync("SubmitScore", { name, score });
}
