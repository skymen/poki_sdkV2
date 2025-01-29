export default function (instanceClass) {
  return class extends instanceClass {
    constructor(sdkType, inst) {
      super(sdkType, inst);
    }

    Release() {}

    OnCreate() {}

    OnPlacedInLayout() {}

    OnPropertyChanged(id, value) {}
  };
}
