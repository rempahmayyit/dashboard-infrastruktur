// scripts/compress-og.js

import sharp from "sharp";
import fs from "fs";

const input = "./public/og-image.png";
const output = "./public/og-image.jpg";

await sharp(input)
  .resize({
    width: 1200,
    height: 630,
    fit: "cover",
  })
  .jpeg({
    quality: 82,
    mozjpeg: true,
  })
  .toFile(output);

const oldSize = (
  fs.statSync(input).size /
  1024 /
  1024
).toFixed(2);

const newSize = (
  fs.statSync(output).size /
  1024 /
  1024
).toFixed(2);

console.log(`Sebelum : ${oldSize} MB`);
console.log(`Sesudah : ${newSize} MB`);
console.log("Selesai");