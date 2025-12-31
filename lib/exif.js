const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args);
    let err = "";
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("close", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(err || `Process exit code ${code}`));
    });
  });
}

function tmp(ext) {
  const dir = path.join(process.cwd(), "media");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`);
}

// convert image/video buffer to webp sticker
async function toWebp(buffer, ffmpegPath = "ffmpeg") {
  const input = tmp("bin");
  const output = tmp("webp");
  fs.writeFileSync(input, buffer);

  const args = [
    "-y",
    "-i", input,
    "-vcodec", "libwebp",
    "-vf", "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=0x00000000",
    "-lossless", "1",
    "-qscale", "75",
    "-preset", "default",
    "-an",
    "-vsync", "0",
    output
  ];

  await run(ffmpegPath, args);
  const out = fs.readFileSync(output);

  fs.unlinkSync(input);
  fs.unlinkSync(output);

  return out;
}

module.exports = {
  toWebp
};
