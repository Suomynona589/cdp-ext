!function (global, factory) {
  // UMD wrapper like GSAP
  if (typeof exports === "object" && typeof module !== "undefined") {
    factory(exports);
  } else if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else {
    factory((global.FixedJS = {}));
  }
}(this, function (exports) {
  "use strict";

  // Make sleep available immediately
  window.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Save original eval
  const originalEval = window.eval;

  // Patch eval so CodePen's JS panel goes through us
  window.eval = function (src) {
    try {
      // Transform: sleep(123) → await sleep(123)
      const transformed = src.replace(/sleep\s*\(/g, 'await sleep(');

      // Wrap user code in async IIFE
      const wrapped = `
        (async () => {
          try {
            ${transformed}
          } catch (e) {
            console.error("[Runtime Error]", e);
          }
        })();
      `;

      return originalEval(wrapped);
    } catch (e) {
      console.error("[Extension Error]", e);
    }
  };

  exports.sleep = window.sleep;
});
