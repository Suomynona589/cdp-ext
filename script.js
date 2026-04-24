// Make sleep available immediately
window.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Save originals
const _eval = window.eval;
const _Function = window.Function;

// Transform user code
function transform(src) {
  return src.replace(/(^|[^a-zA-Z0-9_$])sleep\s*\(/g, '$1await sleep(');
}

// Patch eval
window.eval = function (src) {
  const wrapped = `
    (async () => {
      try {
        ${transform(src)}
      } catch (e) {
        console.error("[Runtime Error]", e);
      }
    })();
  `;
  return _eval(wrapped);
};

// Patch Function constructor (CodePen uses this)
window.Function = function (...args) {
  const body = args.pop();
  const wrapped = transform(body);
  return _Function(...args, `
    (async () => {
      ${wrapped}
    })();
  `);
};
