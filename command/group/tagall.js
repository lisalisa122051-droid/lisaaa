module.exports = {
  name: "tagall",
  aliases: ["alltag"],
  category: "Group",
  desc: "Mention semua member",
  groupOnly: true,
  async run(ctx) {
    try {
      const meta = await ctx.sock.groupMetadata(ctx.from);
      const members = meta?.participants || [];
      if (!members.length) return ctx.reply("🍬 Member tidak ditemukan.");

      const mentions = members.map((p) => p.id);
      const text =
        `🌷 *Tag All* 💗\n` +
        mentions.map((jid, i) => `🍬 ${i + 1}. @${jid.split("@")[0]}`).join("\n");

      await ctx.sock.sendMessage(
        ctx.from,
        { text, mentions },
        { quoted: ctx.m }
      );
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error tagall.");
    }
  }
};
