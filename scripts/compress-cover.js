// scripts/compress-cover.js

import sharp from "sharp";
import fs from "fs";

const input = "./src/assets/bg-CoverLayout.png";
const output = "./src/assets/bg-CoverLayout.webp";

const metadata = await sharp(input).metadata();

let width = metadata.width;

if (width > 1920) {
  width = 1920;
}

await sharp(input)
  .resize({ width })
  .webp({
    quality: 80,
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