const QUOTES = [
  "🌷 Kamu nggak harus kuat setiap saat—cukup tetap jalan, pelan-pelan. 💗",
  "🍬 Hal kecil yang kamu lakukan hari ini bisa jadi harapan besar besok. 🫶🏻",
  "💗 Kamu berharga, bahkan saat kamu merasa biasa saja."
];

module.exports = {
  name: "quotes",
  aliases: ["quote"],
  category: "Aesthetic",
  desc: "Quotes aesthetic random",
  async run(ctx) {
    try {
      const pick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      return ctx.reply(`🌷 *Aesthetic Quotes* 🍬\n${pick}`);
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error quotes.");
    }
  }
};
