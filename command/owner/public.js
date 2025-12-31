module.exports = {
  name: "public",
  aliases: [],
  category: "Owner",
  desc: "Mode public",
  ownerOnly: true,
  async run(ctx) {
    try {
      ctx.config.public = true;
      return ctx.reply("🌷 Mode: *PUBLIC* 🍬\n💗 Semua user bisa pakai bot.");
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error public.");
    }
  }
};
