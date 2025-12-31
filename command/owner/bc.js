module.exports = {
  name: "bc",
  aliases: ["broadcast"],
  category: "Owner",
  desc: "Broadcast ke chat yang ada di store",
  ownerOnly: true,
  async run(ctx) {
    try {
      const text = ctx.text?.trim();
      if (!text) return ctx.reply("🌷 Contoh: .bc Halo semua 💗");

      const chats = Object.keys(ctx.store.chats || {});
      if (!chats.length) return ctx.reply("🍬 Tidak ada chat di store (coba interaksi dulu).");

      let sent = 0;
      for (const jid of chats) {
        // skip status
        if (jid === "status@broadcast") continue;
        try {
          await ctx.sock.sendMessage(jid, { text: `🌷 *Broadcast* 🍬\n💗 ${text}` });
          sent++;
        } catch {}
      }

      return ctx.reply(`💗 Broadcast terkirim: *${sent}* chat 🫶🏻`);
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error broadcast.");
    }
  }
};
