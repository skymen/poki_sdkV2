import { id as DOM_COMPONENT_ID } from "../config.caw.js";
import createDomClass from "../src/domside/index.js";
self.RuntimeInterface.AddDOMHandlerClass(
  createDomClass(
    class extends self.DOMHandler {
      constructor(iRuntime) {
        super(iRuntime, DOM_COMPONENT_ID);
      }
    }
  )
);
