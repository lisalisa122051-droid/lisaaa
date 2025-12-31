module.exports = {
  name: "instagram",
  aliases: ["ig"],
  category: "Downloader",
  desc: "Download Instagram (template, tinggal sambungkan API pilihanmu)",
  async run(ctx) {
    try {
      const url = ctx.text?.trim();
      if (!url) return ctx.reply("🌷 Contoh: .instagram https://instagram.com/reel/xxxxx");

      // Template: sambungkan ke API kamu sendiri / paid API / microservice
      // supaya stabil jangka panjang (IG sering berubah).
      return ctx.reply(
        "🍬 Fitur IG downloader masih *template*.\n" +
        "💗 Tips: buat endpoint API sendiri (server) lalu panggil dari sini.\n" +
        "🫶🏻 Aku sudah siapkan strukturnya biar gampang diintegrasi."
      );
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error IG downloader.");
    }
  }
};
