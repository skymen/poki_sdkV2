const SDK = globalThis.SDK;
export default function (parentClass) {
  return class extends parentClass {
    constructor(sdkPlugin, iObjectType) {
      super(sdkPlugin, iObjectType);
    }
  };
}
