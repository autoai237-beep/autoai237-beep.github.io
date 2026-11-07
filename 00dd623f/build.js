/* Ensambla iskairos-completo.html a partir de shell, CSS, datos y vistas. */
const fs = require("fs");
const path = require("path");
const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");

const shell = read("spa-shell.html");
const baseCss = read("iskairos-app.html").split(/\r?\n/).slice(14, 787).join("\n");
const css = baseCss + "\n\n" + read("spa-extra.css");
const logo = "data:image/png;base64," + read("logo.b64").replace(/\s+/g, "");
const appData = read("app-data.gz.b64").replace(/\s+/g, "");
const helpData = read("ayuda-data.json").trim();
const providers = read("proveedores-data.json").trim();

const content = read("spa-content.js").split("__PROVIDERS__").join(providers);
const files = {
  __CORE__: read("spa-core.js"),
  __VIEWS_A__: read("spa-views-a.js"),
  __VIEWS_B__: read("spa-views-b.js"),
  __VIEWS_C__: read("spa-views-c.js"),
  __GUIDE__: read("spa-guide.js"),
  __BOOT__: read("spa-boot.js")
};

for (const [key, code] of Object.entries(files)) {
  if (/<\/script/i.test(code)) throw new Error(key + " contiene </script> literal");
}
if (/<\/style/i.test(css)) throw new Error("El CSS contiene </style> literal");

const parts = {
  __CSS__: css,
  __LOGO__: logo,
  __APPDATA__: appData,
  __HELPDATA__: helpData,
  __CONTENT__: content,
  ...files
};

let out = shell;
for (const [key, value] of Object.entries(parts)) {
  if (!out.includes(key)) throw new Error("Falta el marcador " + key + " en shell");
  out = out.split(key).join(value);
}
const left = out.match(/__[A-Z_]+__/g);
if (left) throw new Error("Marcadores sin reemplazar: " + [...new Set(left)].join(", "));

if (/<\/script/i.test(content) || /<\/script/i.test(helpData)) {
  throw new Error("Datos con </script> literal");
}

const target = path.join(dir, "iskairos-completo.html");
fs.writeFileSync(target, out, "utf8");
console.log("OK →", target, (Buffer.byteLength(out) / 1024).toFixed(1) + " KB");
