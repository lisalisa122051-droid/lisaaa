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
  name: "tomp3",
  aliases: ["mp3"],
  category: "Converter",
  desc: "Convert video to mp3 (reply video)",
  async run(ctx) {
    try {
      const msg = ctx.m.message?.ephemeralMessage?.message || ctx.m.message;
      const type = getContentType(msg);

      const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedType = quoted ? getContentType(quoted) : null;

      let vid = null;
      if (quoted && quotedType === "videoMessage") vid = quoted.videoMessage;
      else if (type === "videoMessage") vid = msg.videoMessage;

      if (!vid) return ctx.reply("🌷 Reply video dengan: .tomp3");

      const stream = await downloadContentFromMessage(vid, "video");
      let buffer = Buffer.from([]);
      for await (const c of stream) buffer = Buffer.concat([buffer, c]);

      const inVid = tmp("mp4");
      const outMp3 = tmp("mp3");
      fs.writeFileSync(inVid, buffer);

      await run(ctx.config.ffmpeg, ["-y", "-i", inVid, "-vn", "-ab", "128k", "-ar", "44100", outMp3]);

      const mp3 = fs.readFileSync(outMp3);
      fs.unlinkSync(inVid);
      fs.unlinkSync(outMp3);

      await ctx.sock.sendMessage(ctx.from, { audio: mp3, mimetype: "audio/mpeg" }, { quoted: ctx.m });
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Gagal convert. Pastikan ffmpeg tersedia.");
    }
  }
};
