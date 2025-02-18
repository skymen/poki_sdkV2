export const config = {
  highlight: true,
  deprecated: false,
  returnType: "string",
  description: "Last Ad Tag",
  params: [],
};

export const expose = false;

export default function () {
  return this.lastAdTag;
}
