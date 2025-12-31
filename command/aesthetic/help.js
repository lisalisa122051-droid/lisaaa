const help = require("../../message/help");

module.exports = {
  name: "help",
  aliases: ["bantuan"],
  category: "Main Menu",
  desc: "Bantuan penggunaan bot",
  async run(ctx) {
    try {
      return ctx.reply(help.text(ctx.prefix || "."));
    } catch (e) {
      console.error(e);
      return ctx.reply("💗 Error saat membuka help.");
    }
  }
};
