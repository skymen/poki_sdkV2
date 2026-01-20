export const config = {
  highlight: false,
  deprecated: false,
  isAsync: false,
  listName: "Move Pill",
  displayText: "Move pill [i]{0}[/i]% from top + [i]{1}[/i]px",
  description:
    "Reposition the Poki Pill on mobile. topPercent (0-50) sets vertical position as percentage from top, topPx is additional pixel offset (positive moves down, negative moves up)",
  params: [
    {
      id: "topPercent",
      autocompleteId: "topPercent",
      name: "Top Percent",
      desc: "Vertical position as percentage from top (0-50)",
      type: "number",
      initialValue: "0",
    },
    {
      id: "topPx",
      autocompleteId: "topPx",
      name: "Top Pixels",
      desc: "Additional pixel offset (positive moves down, negative moves up)",
      type: "number",
      initialValue: "20",
    },
  ],
};

export const expose = true;

export default function (topPercent, topPx) {
  this._postToDOMAsync("MovePill", { topPercent, topPx });
}
