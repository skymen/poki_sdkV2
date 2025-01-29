export default function getAceConfigs() {
  return Promise.all([
    import("../generated/actions.js"),
    import("../generated/conditions.js"),
    import("../generated/expressions.js"),
  ]);
}
