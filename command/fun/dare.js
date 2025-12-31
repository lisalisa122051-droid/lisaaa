const DARE = [
  "Kirim voice note bilang: 'aku lucu banget hari ini' 🫶🏻",
  "Tag seseorang dan bilang sesuatu yang manis 💗",
  "Kirim emoji 🌷🍬💗🫶🏻 berturut-turut!"
];

module.exports = {
  name: "dare",
  aliases: [],
  category: "Fun",
  desc: "Dare random",
  async run(ctx) {
    try {
      const pick = DARE[Math.floor(Math.random() * DARE.length)];
      return ctx.reply(`🌷 *Dare* 🍬\n💗 ${pick}`);
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error dare.");
    }
  }
};
