const { buildMenuText, buildListPayload } = require("../../message/allmenu");

module.exports = {
  name: "menu",
  aliases: ["allmenu"],
  category: "Main Menu",
  desc: "Menampilkan All Menu",
  async run(ctx) {
    try {
      const { sock, m, sender, pushName, isGroup, from, config } = ctx;

      let groupName = "";
      if (isGroup) {
        // aman: try metadata
        try {
          const meta = await sock.groupMetadata(from);
          groupName = meta?.subject || "";
        } catch {}
      }

      const isOwner = config.ownerNumber.includes(sender.replace("@s.whatsapp.net", ""));
      const uptime = process.uptime();

      const prefix = ctx.prefix || ".";
      const menuText = buildMenuText({
        pushName,
        sender,
        prefix,
        isGroup,
        groupName,
        isOwner,
        uptime
      });

      // list payload (fallback ke text kalau gagal)
      const list = buildListPayload({ menuText, prefix });

      try {
        await sock.sendMessage(from, list, { quoted: m });
      } catch {
        await sock.sendMessage(from, { text: menuText }, { quoted: m });
      }
    } catch (e) {
      console.error(e);
      await ctx.reply("🍬 Terjadi error saat menampilkan menu.");
    }
  }
};
