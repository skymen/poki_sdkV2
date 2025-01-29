export default function getAceConfigs() {
  return Promise.all([
    import("../generated/actionConfig.js"),
    import("../generated/conditionConfig.js"),
    import("../generated/expressionConfig.js"),
  ]);
}
