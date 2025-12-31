module.exports = {
  name: "jodoh",
  aliases: ["couple"],
  category: "Fun",
  desc: "Cek jodoh random (group lebih seru)",
  async run(ctx) {
    try {
      let a = ctx.sender;
      let b = "someone@s.whatsapp.net";

      if (ctx.isGroup) {
        const meta = await ctx.sock.groupMetadata(ctx.from);
        const members = meta?.participants?.map((p) => p.id) || [];
        if (members.length >= 2) {
          b = members[Math.floor(Math.random() * members.length)];
        }
      }

      const text = `🌷 *Jodoh Finder* 💗\n🫶🏻 @${a.split("@")[0]}  x  @${b.split("@")[0]}\n🍬 Semoga langgeng yaa~`;
      await ctx.sock.sendMessage(ctx.from, { text, mentions: [a, b] }, { quoted: ctx.m });
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error jodoh.");
    }
  }
};
