const fs = require("fs");
const path = require("path");
function walk(dir, arr) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, arr);
    else arr.push(p);
  }
}
const files = [];
walk(path.join(__dirname, "..", "src"), files);
const ts = new Set(files.filter((f) => f.endsWith(".ts")));
const tsx = new Set(files.filter((f) => f.endsWith(".tsx")));
const duplicates = files.filter(
  (f) =>
    f.endsWith(".js") &&
    (ts.has(f.replace(/\.js$/, ".ts")) || tsx.has(f.replace(/\.js$/, ".tsx"))),
);
duplicates.forEach((f) =>
  console.log(path.relative(path.join(__dirname, ".."), f)),
);
if (duplicates.length === 0) process.exit(1);
