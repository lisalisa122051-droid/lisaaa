const { getBuffer } = require("../../lib/myfunc");

module.exports = {
  name: "wallpaper",
  aliases: ["wp"],
  category: "Aesthetic",
  desc: "Wallpaper random (source: picsum)",
  async run(ctx) {
    try {
      // Simple & stabil: picsum random image
      const url = "https://picsum.photos/1080/1920";
      const buf = await getBuffer(url, { timeout: 20000 });

      await ctx.sock.sendMessage(
        ctx.from,
        { image: buf, caption: "🌷 Wallpaper untuk kamu 💗" },
        { quoted: ctx.m }
      );
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Gagal ambil wallpaper (coba lagi yaa).");
    }
  }
};
