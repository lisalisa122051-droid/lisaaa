module.exports = {
  name: "antilink",
  aliases: ["al"],
  category: "Group",
  desc: "Toggle anti-link",
  groupOnly: true,
  async run(ctx) {
    try {
      const group = await ctx.db.groupsDB.get(ctx.from);
      const next = { ...group, antilink: !group.antilink };
      await ctx.db.groupsDB.set(ctx.from, next);
      return ctx.reply(`🌷 AntiLink: *${next.antilink ? "ON" : "OFF"}* 🍬`);
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error toggle antilink.");
    }
  }
};
