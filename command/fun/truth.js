const TRUTH = [
  "Apa rahasia kecil yang belum pernah kamu cerita ke siapapun? 💗",
  "Siapa orang yang paling kamu kangenin akhir-akhir ini? 🫶🏻",
  "Hal paling kamu syukuri minggu ini apa? 🌷"
];

module.exports = {
  name: "truth",
  aliases: [],
  category: "Fun",
  desc: "Truth random",
  async run(ctx) {
    try {
      const pick = TRUTH[Math.floor(Math.random() * TRUTH.length)];
      return ctx.reply(`🌷 *Truth* 🍬\n💗 ${pick}`);
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error truth.");
    }
  }
};
