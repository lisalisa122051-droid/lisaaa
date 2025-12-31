function formatUptime(seconds) {
  seconds = Number(seconds || 0);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

function buildMenuText({ pushName, sender, prefix, isGroup, groupName, isOwner, uptime }) {
  const cuteLine = "┈┈┈┈┈┈┈┈┈┈┈┈┈┈";
  const head =
`🌷  *${"A E S T H E T I C   M E N U"}*
🍬  ${cuteLine}`;

  const info =
`💗  *Info User*
🫶🏻  Nama  : ${pushName}
🫶🏻  JID   : ${sender}
🫶🏻  Chat  : ${isGroup ? `Group (${groupName || "-"})` : "Private"}
🫶🏻  Mode  : ${isOwner ? "Owner" : "User"}
🫶🏻  Uptime: ${formatUptime(uptime)}

🍬  ${cuteLine}`;

  const main =
`🌷  *Main Menu*
🍬  ${prefix}menu
🍬  ${prefix}help`;

  const downloader =
`🌷  *Downloader*
🍬  ${prefix}tiktok <url>
🍬  ${prefix}instagram <url>
🍬  ${prefix}ytmp3 <url>`;

  const group =
`🌷  *Group*
🍬  ${prefix}welcome
🍬  ${prefix}antilink
🍬  ${prefix}tagall`;

  const fun =
`🌷  *Fun*
🍬  ${prefix}jodoh
🍬  ${prefix}truth
🍬  ${prefix}dare`;

  const aesthetic =
`🌷  *Aesthetic*
🍬  ${prefix}quotes
🍬  ${prefix}wallpaper
🍬  ${prefix}ppcouple`;

  const converter =
`🌷  *Converter*
🍬  ${prefix}sticker
🍬  ${prefix}toimg
🍬  ${prefix}tomp3`;

  const owner =
`🌷  *Owner*
🍬  ${prefix}self
🍬  ${prefix}public
🍬  ${prefix}bc <text>
🍬  ${prefix}restart`;

  const foot =
`🍬  ${cuteLine}
💗  *${"Semoga harimu manis & lembut ya 🫶🏻"}*
🌷  ${"Aesthetic Bot"} • ${new Date().toLocaleString("id-ID")}`;

  return [
    head,
    info,
    main,
    "",
    downloader,
    "",
    group,
    "",
    fun,
    "",
    aesthetic,
    "",
    converter,
    "",
    owner,
    "",
    foot
  ].join("\n");
}

function buildListPayload({ menuText, prefix }) {
  // List message (ramah WhatsApp list)
  return {
    text: menuText,
    footer: "💗 pilih menu di bawah yaa 🫶🏻",
    title: "🌷 Aesthetic Menu",
    buttonText: "🍬 Open Menu",
    sections: [
      {
        title: "🌷 Main Menu",
        rows: [
          { title: `${prefix}menu`, description: "Tampilkan All Menu", rowId: `${prefix}menu` },
          { title: `${prefix}help`, description: "Info bantuan", rowId: `${prefix}help` }
        ]
      },
      {
        title: "🌷 Downloader",
        rows: [
          { title: `${prefix}tiktok`, description: "Download TikTok", rowId: `${prefix}tiktok` },
          { title: `${prefix}instagram`, description: "Download IG", rowId: `${prefix}instagram` },
          { title: `${prefix}ytmp3`, description: "Download audio YouTube", rowId: `${prefix}ytmp3` }
        ]
      },
      {
        title: "🌷 Group",
        rows: [
          { title: `${prefix}welcome`, description: "Toggle welcome", rowId: `${prefix}welcome` },
          { title: `${prefix}antilink`, description: "Toggle antilink", rowId: `${prefix}antilink` },
          { title: `${prefix}tagall`, description: "Mention semua member", rowId: `${prefix}tagall` }
        ]
      },
      {
        title: "🌷 Fun",
        rows: [
          { title: `${prefix}jodoh`, description: "Cek jodoh random", rowId: `${prefix}jodoh` },
          { title: `${prefix}truth`, description: "Truth question", rowId: `${prefix}truth` },
          { title: `${prefix}dare`, description: "Dare challenge", rowId: `${prefix}dare` }
        ]
      },
      {
        title: "🌷 Aesthetic",
        rows: [
          { title: `${prefix}quotes`, description: "Quotes aesthetic", rowId: `${prefix}quotes` },
          { title: `${prefix}wallpaper`, description: "Wallpaper random", rowId: `${prefix}wallpaper` },
          { title: `${prefix}ppcouple`, description: "PP couple random", rowId: `${prefix}ppcouple` }
        ]
      },
      {
        title: "🌷 Converter",
        rows: [
          { title: `${prefix}sticker`, description: "Image/Video to sticker", rowId: `${prefix}sticker` },
          { title: `${prefix}toimg`, description: "Sticker to image (ffmpeg)", rowId: `${prefix}toimg` },
          { title: `${prefix}tomp3`, description: "Video to mp3 (ffmpeg)", rowId: `${prefix}tomp3` }
        ]
      }
    ]
  };
}

module.exports = {
  buildMenuText,
  buildListPayload
};
