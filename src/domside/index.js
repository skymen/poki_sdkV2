export default function (parentClass) {
  return class extends parentClass {
    constructor(iRuntime) {
      super(iRuntime);
    }
  };
}
