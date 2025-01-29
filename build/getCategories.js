export default function getCategories(
  actionConfig,
  conditionConfig,
  expressionConfig
) {
  let categories = [
    ...new Set([
      ...Object.values(actionConfig.categories),
      ...Object.values(conditionConfig.categories),
      ...Object.values(expressionConfig.categories),
    ]),
  ];
  return categories;
}
