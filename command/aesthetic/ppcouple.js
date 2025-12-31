module.exports = {
  name: "ppcouple",
  aliases: ["pp"],
  category: "Aesthetic",
  desc: "PP Couple random",
  async run(ctx) {
    try {
      const a = Math.floor(Math.random() * 90) + 1;
      const b = Math.floor(Math.random() * 90) + 1;

      // randomuser portrait (umum dipakai)
      const img1 = `https://randomuser.me/api/portraits/women/${a}.jpg`;
      const img2 = `https://randomuser.me/api/portraits/men/${b}.jpg`;

      await ctx.sock.sendMessage(
        ctx.from,
        {
          text: `🌷 *PP Couple* 💗\n🫶🏻 Cewek: ${img1}\n🫶🏻 Cowok: ${img2}\n🍬 Cocok nggak?`
        },
        { quoted: ctx.m }
      );
    } catch (e) {
      console.error(e);
      return ctx.reply("🍬 Error ppcouple.");
    }
  }
};
