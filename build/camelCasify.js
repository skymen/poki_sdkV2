export default function (str) {
  let result = str
    .replace(/[^a-zA-Z0-9$_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word, i) =>
      i === 0 ? word : word.charAt(0).toUpperCase() + word.substring(1)
    )
    .join("");

  if (!isNaN(parseInt(result.charAt(0)))) {
    return `_${result}`;
  }
  return result;
}
