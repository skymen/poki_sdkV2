export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
    }

    _onCreate() {}
  };
}
