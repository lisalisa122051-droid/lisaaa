module.exports = {
  name: "self",
  aliases: [],
  category: "Owner",
  desc: "Mode self (hanya owner)",
  ownerOnly: true,
  async run(ctx) {
    try {
      ctx.config.public = false;
      return ctx.reply("🌷 Mode: *SELF* 💗\n🫶🏻 Hanya owner yang bisa pakai bot.");
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error self.");
    }
  }
};
