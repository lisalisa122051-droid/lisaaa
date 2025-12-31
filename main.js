const fs = require("fs");
const path = require("path");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const { Boom } = require("@hapi/boom");

const config = require("./config");
const DB = require("./lib/function");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  DisconnectReason,
  getContentType,
  jidNormalizedUser
} = require("@whiskeysockets/baileys");

const { isUrl, pickPrefix } = require("./lib/myfunc");

// ========= DB =========
const usersDB = new DB.JSONDB("./database/users.json");
const groupsDB = new DB.JSONDB("./database/groups.json");

// ========= Store (optional, buat broadcast / metadata caching) =========
const store = makeInMemoryStore({
  logger: pino({ level: "silent" }).child({ level: "silent" })
});

// ========= Command Loader =========
function loadCommands(dir = path.join(__dirname, "command")) {
  const commands = new Map();
  const aliases = new Map();

  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const full = path.join(currentDir, file);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        walk(full);
        continue;
      }

      if (!file.endsWith(".js")) continue;

      delete require.cache[require.resolve(full)];
      const cmd = require(full);

      if (!cmd?.name || typeof cmd.run !== "function") continue;

      commands.set(cmd.name, cmd);
      if (Array.isArray(cmd.aliases)) {
        for (const a of cmd.aliases) aliases.set(a, cmd.name);
      }
    }
  }

  walk(dir);
  return { commands, aliases };
}

const { commands, aliases } = loadCommands();

// ========= Util Reply =========
async function reply(sock, m, text) {
  return sock.sendMessage(
    m.key.remoteJid,
    { text },
    { quoted: m }
  );
}

// ========= Parse Message =========
function extractBody(m) {
  if (!m.message) return "";
  // unwrap ephemeral
  if (m.message.ephemeralMessage) m.message = m.message.ephemeralMessage.message;

  const type = getContentType(m.message);
  const msg = m.message[type];

  if (!msg) return "";

  if (type === "conversation") return m.message.conversation || "";
  if (type === "extendedTextMessage") return msg.text || "";
  if (type === "imageMessage") return msg.caption || "";
  if (type === "videoMessage") return msg.caption || "";
  return "";
}

async function start() {
  // Baileys latest WA Web version (recommended)
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: undefined })); // aman kalau gagal

  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    generateHighQualityLinkPreview: true
  });

  store.bind(sock.ev);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log("📌 Scan QR di WhatsApp > Linked devices");
    }

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Logout. Hapus folder /session lalu scan ulang.");
      } else {
        console.log("🔁 Reconnect...");
        start().catch(console.error);
      }
    }

    if (connection === "open") {
      console.log("✅ Bot connected:", sock.user?.id);
    }
  });

  sock.ev.on("messages.upsert", async (upsert) => {
    try {
      const m = upsert.messages?.[0];
      if (!m?.message) return;
      if (m.key?.remoteJid === "status@broadcast") return;

      const from = m.key.remoteJid;
      const isGroup = from.endsWith("@g.us");
      const sender = jidNormalizedUser(isGroup ? m.key.participant : from);
      const pushName = m.pushName || "User";

      const body = extractBody(m).trim();
      if (!body) return;

      // prefix handler
      const prefix = pickPrefix(body, config.prefixes);
      const isCmd = !!prefix;

      // DB ensure
      const user = await usersDB.ensure(sender, {
        jid: sender,
        name: pushName,
        premium: false,
        limit: config.defaultLimit,
        lastSeen: Date.now()
      });

      let group = null;
      if (isGroup) {
        group = await groupsDB.ensure(from, {
          jid: from,
          welcome: false,
          antilink: false
        });
      }

      // update lastSeen
      await usersDB.set(sender, { ...user, lastSeen: Date.now() });

      // features non-command (antilink)
      if (isGroup && group?.antilink && isUrl(body)) {
        // skip kalau owner / admin tidak dicek di template basic ini (bisa kamu upgrade)
        await reply(sock, m, "🫶🏻 Link terdeteksi. Fitur *AntiLink* aktif.");
      }

      // kalau bukan command, stop (template clean)
      if (!isCmd) return;

      const args = body.slice(prefix.length).trim().split(/\s+/);
      const commandName = (args.shift() || "").toLowerCase();
      const text = args.join(" ");

      const realName = commands.has(commandName)
        ? commandName
        : aliases.get(commandName);

      if (!realName) return;

      const cmd = commands.get(realName);
      const isOwner = config.ownerNumber.includes(sender.replace("@s.whatsapp.net", ""));

      // mode self/public
      if (!config.public && !isOwner) return;

      // guard
      if (cmd.ownerOnly && !isOwner) {
        return reply(sock, m, "💗 Fitur ini khusus *Owner* yaa.");
      }
      if (cmd.groupOnly && !isGroup) {
        return reply(sock, m, "🍬 Command ini khusus *Group* yaa.");
      }

      const ctx = {
        sock,
        m,
        from,
        sender,
        pushName,
        isGroup,
        prefix,
        commandName: realName,
        args,
        text,
        db: { usersDB, groupsDB },
        config,
        store,
        reply: (t) => reply(sock, m, t)
      };

      await cmd.run(ctx);
    } catch (e) {
      console.error("HandlerError:", e);
    }
  });
}

start().catch(console.error);
