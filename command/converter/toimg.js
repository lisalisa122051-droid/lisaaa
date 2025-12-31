const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { getContentType, downloadContentFromMessage } = require("@whiskeysockets/baileys");

function tmp(ext) {
  const dir = path.join(process.cwd(), "media");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args);
    let err = "";
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("close", (code) => (code === 0 ? resolve(true) : reject(new Error(err))));
  });
}

module.exports = {
  name: "toimg",
  aliases: ["toimage"],
  category: "Converter",
  desc: "Convert sticker to image (reply sticker)",
  async run(ctx) {
    try {
      const msg = ctx.m.message?.ephemeralMessage?.message || ctx.m.message;
      const type = getContentType(msg);
      const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedType = quoted ? getContentType(quoted) : null;

      let st = null;
      if (quoted && quotedType === "stickerMessage") st = quoted.stickerMessage;
      else if (type === "stickerMessage") st = msg.stickerMessage;

      if (!st) return ctx.reply("🌷 Reply sticker dengan: .toimg");

      const stream = await downloadContentFromMessage(st, "sticker");
      let buffer = Buffer.from([]);
      for await (const c of stream) buffer = Buffer.concat([buffer, c]);

      const inWebp = tmp("webp");
      const outPng = tmp("png");
      fs.writeFileSync(inWebp, buffer);

      await run(ctx.config.ffmpeg, ["-y", "-i", inWebp, outPng]);

      const png = fs.readFileSync(outPng);
      fs.unlinkSync(inWebp);
      fs.unlinkSync(outPng);

      await ctx.sock.sendMessage(ctx.from, { image: png, caption: "🌷 Nih jadi gambar 💗" }, { quoted: ctx.m });
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Gagal convert. Pastikan ffmpeg tersedia.");
    }
  }
};
