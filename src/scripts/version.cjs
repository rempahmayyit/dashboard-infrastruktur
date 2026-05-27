const fs = require("fs");

const packageJson = require("../package.json");

const now = new Date(
  new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  })
);

const pad = (n) => String(n).padStart(2, "0");

const buildTime =
  `${now.getFullYear()}.` +
  `${pad(now.getMonth() + 1)}.` +
  `${pad(now.getDate())}-` +
  `${pad(now.getHours())}${pad(now.getMinutes())}`;

const versionText =
  `v${packageJson.version} • ${buildTime}`;

const envContent =
  `VITE_APP_VERSION=${versionText}`;

fs.writeFileSync(".env.local", envContent);

console.log("Generated version:", versionText);