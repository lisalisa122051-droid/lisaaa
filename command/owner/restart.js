module.exports = {
  name: "restart",
  aliases: ["reboot"],
  category: "Owner",
  desc: "Restart bot (panel akan auto start lagi)",
  ownerOnly: true,
  async run(ctx) {
    try {
      await ctx.reply("🌷 Restarting... 🍬");
      process.exit(0);
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error restart.");
    }
  }
};
