module.exports = {
  name: "ytmp3",
  aliases: ["yta"],
  category: "Downloader",
  desc: "YouTube to audio (template)",
  async run(ctx) {
    try {
      const url = ctx.text?.trim();
      if (!url) return ctx.reply("🌷 Contoh: .ytmp3 https://youtube.com/watch?v=xxxx");

      return ctx.reply(
        "🍬 Fitur .ytmp3 masih *template*.\n" +
        "💗 Cara paling stabil: gunakan API/worker sendiri (mis. yt-dlp di server) lalu bot tinggal fetch hasilnya.\n" +
        "🫶🏻 Kalau kamu mau, aku bisa bikinkan versi yang terhubung ke endpoint yt-dlp."
      );
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error ytmp3.");
    }
  }
};
