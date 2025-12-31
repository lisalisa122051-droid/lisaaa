module.exports = {
  name: "welcome",
  aliases: ["wc"],
  category: "Group",
  desc: "Toggle welcome",
  groupOnly: true,
  async run(ctx) {
    try {
      const group = await ctx.db.groupsDB.get(ctx.from);
      const next = { ...group, welcome: !group.welcome };
      await ctx.db.groupsDB.set(ctx.from, next);
      return ctx.reply(`🌷 Welcome: *${next.welcome ? "ON" : "OFF"}* 💗`);
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error toggle welcome.");
    }
  }
};
