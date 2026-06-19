import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./src/assets";

async function compressImages() {
  const files = fs
    .readdirSync(inputDir)
    .filter(
      (file) =>
        file.startsWith("proyek") &&
        (file.endsWith(".jpg") ||
          file.endsWith(".jpeg") ||
          file.endsWith(".png")),
    );

  console.log(`Ditemukan ${files.length} file`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);

    const metadata = await sharp(inputPath).metadata();

    let width = metadata.width;

    if (width > 1920) {
      width = 1920;
    }

    await sharp(inputPath)
      .resize({ width })
      .jpeg({
        quality: 75,
        mozjpeg: true,
      })
      .toFile(inputPath + ".tmp");

    fs.renameSync(inputPath + ".tmp", inputPath);

    const oldSize = (
      fs.statSync(inputPath).size /
      1024 /
      1024
    ).toFixed(2);

    console.log(`✓ ${file}`);
  }

  console.log("Selesai");
}

compressImages();