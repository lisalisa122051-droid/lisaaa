const { getContentType, downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { toWebp } = require("../../lib/exif");

module.exports = {
  name: "sticker",
  aliases: ["s"],
  category: "Converter",
  desc: "Buat sticker dari foto/video (reply media)",
  async run(ctx) {
    try {
      const msg = ctx.m.message?.ephemeralMessage?.message || ctx.m.message;
      const type = getContentType(msg);

      // bisa dari quoted
      const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedType = quoted ? getContentType(quoted) : null;

      let targetMsg = null;
      let targetType = null;

      if (quoted && (quotedType === "imageMessage" || quotedType === "videoMessage")) {
        targetMsg = quoted[quotedType];
        targetType = quotedType;
      } else if (type === "imageMessage" || type === "videoMessage") {
        targetMsg = msg[type];
        targetType = type;
      }

      if (!targetMsg) {
        return ctx.reply("🌷 Reply foto/video dengan caption: .sticker");
      }

      const stream = await downloadContentFromMessage(targetMsg, targetType.replace("Message", ""));
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

      const webp = await toWebp(buffer, ctx.config.ffmpeg);

      await ctx.sock.sendMessage(
        ctx.from,
        { sticker: webp },
        { quoted: ctx.m }
      );
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Gagal bikin sticker. Pastikan ffmpeg tersedia.");
    }
  }
};
